import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// أقصى حجم مسموح به للملف: 10 ميجابايت
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.docx'];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم تحديد أي ملف للرفع' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'حجم الملف كبير جداً، الحد الأقصى المسموح به هو 10 ميجابايت' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'activity-file';
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: 'نوع الملف غير مدعوم. يرجى رفع صورة (PNG, JPG, WEBP) أو مستند (PDF, DOCX)',
        },
        { status: 400 }
      );
    }

    // 1. إذا توفرت بيانات Cloudinary في البيئة، يمكن الرفع عليها مباشرة
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const buffer = Buffer.from(await file.arrayBuffer());

    if (cloudName && apiKey && apiSecret) {
      try {
        const base64Data = buffer.toString('base64');
        const mimeType = file.type || 'application/octet-stream';
        const dataUri = `data:${mimeType};base64,${base64Data}`;

        const timestamp = Math.round(new Date().getTime() / 1000);
        // رفع مباشر لـ Cloudinary عبر REST API
        const crypto = await import('crypto');
        const signatureStr = `folder=faculty_activities&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

        const cloudFormData = new FormData();
        cloudFormData.append('file', dataUri);
        cloudFormData.append('timestamp', timestamp.toString());
        cloudFormData.append('api_key', apiKey);
        cloudFormData.append('folder', 'faculty_activities');
        cloudFormData.append('signature', signature);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: 'POST',
            body: cloudFormData,
          }
        );

        if (uploadRes.ok) {
          const cloudData = await uploadRes.json();
          return NextResponse.json({
            success: true,
            fileUrl: cloudData.secure_url || cloudData.url,
            fileName: originalName,
          });
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload fallback to local storage:', cloudErr);
      }
    }

    // 2. الرفع والتخزين المحلي المباشر في public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeFileName = `act-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, safeFileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl: publicUrl,
      fileName: originalName,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء معالجة وحفظ الملف' }, { status: 500 });
  }
}
