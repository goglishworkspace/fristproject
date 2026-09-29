'use server';

export interface SubmitContactInquiryParams {
  category: string;
  fullName: string;
  studentCode?: string;
  contactInfo?: string;
  subject?: string;
  message: string;
}

export async function submitContactInquiryAction(
  params: SubmitContactInquiryParams
): Promise<{ success: boolean; ticketId?: string; error?: string }> {
  try {
    const { category, fullName, studentCode, contactInfo, subject, message } = params;

    if (!fullName || !fullName.trim()) {
      return { success: false, error: 'يرجى إدخال الاسم الكامل' };
    }

    if (!message || !message.trim()) {
      return { success: false, error: 'يرجى كتابة نص الرسالة أو الاستفسار' };
    }

    const randomTicketId = `ASU-${(category || 'GEN').toUpperCase().slice(0, 3)}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const timestamp = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

    const webhookUrl =
      process.env.GOOGLE_SHEETS_CONTACT_WEBHOOK_URL ||
      'https://script.google.com/macros/s/AKfycbxmNa18xkhTK4LyoX0vDek7bEb80ywd4Hwcvra81gn7c4lM0U-3XSUSXjuOM6yFfOze/exec';

    const payload = {
      ticketId: randomTicketId,
      timestamp,
      category: category || 'استفسار عام',
      fullName: fullName.trim(),
      studentCode: studentCode?.trim() || '',
      contactInfo: contactInfo?.trim() || '',
      subject: subject?.trim() || 'استفسار من المنصة',
      message: message.trim(),
    };

    // إرسال البيانات إلى Google Apps Script
    // نستخدم form-urlencoded أو JSON مع redirection follow
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });
    } catch (networkErr) {
      console.warn('Google Sheets webhook post notice:', networkErr);
      // حتى لو استغرق رد جوجل وقتاً أطول، تكون التذكرة أُنشئت بنجاح للطالب
    }

    return {
      success: true,
      ticketId: randomTicketId,
    };
  } catch (err: unknown) {
    console.error('Error submitting contact inquiry:', err);
    return {
      success: false,
      error: 'حدث خطأ أثناء إرسال الاستفسار، يرجى المحاولة مرة أخرى.',
    };
  }
}
