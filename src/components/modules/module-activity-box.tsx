'use client';

import React, { useState } from 'react';
import { submitModuleActivityAction } from '@/lib/actions/module.actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit3,
  Maximize2,
  X,
  ArrowRight,
  ArrowLeft,
  Table as TableIcon,
  HelpCircle,
  Compass,
  Check,
} from 'lucide-react';
import type { ModuleActivity, StudentActivitySubmission } from '@/lib/types/database';

interface ActivityTableRow {
  id: number;
  component: string;
  type: 'طبيعي' | 'بشري';
}

interface MitigationAdaptationItem {
  id: number;
  measure: string;
  type: 'تكيف' | 'تخفيف' | '';
}

interface NeighborhoodMeasureRow {
  id: number;
  measure: string;
  location: string;
  reason: string;
}

interface ModuleActivityBoxProps {
  moduleId: string;
  activityTitle: string;
  activityDescription: string;
  activityImageUrl?: string;
  activities?: ModuleActivity[];
  existingSubmission?: StudentActivitySubmission | null;
  isQuizUnlocked?: boolean;
  onActivityCompleted?: () => void;
  onProceedToQuiz?: () => void;
  onBackToSlides?: () => void;
}

export function ModuleActivityBox({
  moduleId,
  activityTitle,
  activityDescription,
  activityImageUrl,
  activities = [],
  existingSubmission,
  onActivityCompleted,
  onProceedToQuiz,
  onBackToSlides,
}: ModuleActivityBoxProps) {
  // الأنشطة المتاحة (إذا توفرت قائمة الأنشطة نستخدمها، وإلا نستخدم النشاط الفردي)
  const resolvedActivities: ModuleActivity[] =
    activities && activities.length > 0
      ? activities
      : [
          {
            id: 'act-1',
            title: activityTitle,
            description: activityDescription,
            imageUrl: activityImageUrl,
          },
        ];

  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  // =========================================================================
  // إجابات الموديول الأول (مكونات البيئة والعلاقات المكانية)
  // =========================================================================
  // النشاط 1: جدول مكونات البيئة (6 صفوف: 3 طبيعي و 3 بشري)
  const [m1Act1Rows, setM1Act1Rows] = useState<ActivityTableRow[]>([
    { id: 1, component: '', type: 'طبيعي' },
    { id: 2, component: '', type: 'طبيعي' },
    { id: 3, component: '', type: 'طبيعي' },
    { id: 4, component: '', type: 'بشري' },
    { id: 5, component: '', type: 'بشري' },
    { id: 6, component: '', type: 'بشري' },
  ]);
  const [m1Act1Notes, setM1Act1Notes] = useState('');

  // النشاط 2: أين تتركز المشكلة البيئية؟
  const [m1Act2Place, setM1Act2Place] = useState('');
  const [m1Act2Reason, setM1Act2Reason] = useState('');

  // النشاط 3: اختر الموقع الأنسب لإنشاء حديقة عامة
  const [m1Act3Location, setM1Act3Location] = useState('');
  const [m1Act3Reason1, setM1Act3Reason1] = useState('');
  const [m1Act3Reason2, setM1Act3Reason2] = useState('');

  // =========================================================================
  // إجابات الموديول الثاني (التلوث البيئي ومصادره وتوزيعه المكاني)
  // =========================================================================
  // النشاط 1: تتبع مسار التلوث
  const [m2Act1Source, setM2Act1Source] = useState('');
  const [m2Act1Pathway, setM2Act1Pathway] = useState('');
  const [m2Act1AffectedArea, setM2Act1AffectedArea] = useState('');

  // النشاط 2: قارن مستويات التلوث (جدول المنطقتين أ و ب + الأعلى تلوثاً + سببين)
  const [m2Act2CompSourcesA, setM2Act2CompSourcesA] = useState('');
  const [m2Act2CompSourcesB, setM2Act2CompSourcesB] = useState('');
  const [m2Act2CompLandUseA, setM2Act2CompLandUseA] = useState('');
  const [m2Act2CompLandUseB, setM2Act2CompLandUseB] = useState('');
  const [m2Act2CompHumanActA, setM2Act2CompHumanActA] = useState('');
  const [m2Act2CompHumanActB, setM2Act2CompHumanActB] = useState('');
  const [m2Act2CompPollutionLevelA, setM2Act2CompPollutionLevelA] = useState('');
  const [m2Act2CompPollutionLevelB, setM2Act2CompPollutionLevelB] = useState('');
  const [m2Act2HighestRegion, setM2Act2HighestRegion] = useState('');
  const [m2Act2Reason1, setM2Act2Reason1] = useState('');
  const [m2Act2Reason2, setM2Act2Reason2] = useState('');

  // النشاط 3: أين نضع المصنع؟ (الموقع A, B, C + سببي الاختيار)
  const [m2Act3Location, setM2Act3Location] = useState('');
  const [m2Act3Reason1, setM2Act3Reason1] = useState('');
  const [m2Act3Reason2, setM2Act3Reason2] = useState('');

  // =========================================================================
  // إجابات الموديول الثالث (التغيرات المناخية وآثارها البيئية والمكانية)
  // =========================================================================
  // النشاط 1: ماذا تغيّر في المكان؟
  const [m3Act1Change1, setM3Act1Change1] = useState('');
  const [m3Act1Change2, setM3Act1Change2] = useState('');
  const [m3Act1Change3, setM3Act1Change3] = useState('');
  const [m3Act1Explain, setM3Act1Explain] = useState('');
  const [m3Act1Impact, setM3Act1Impact] = useState('');

  // النشاط 2: أين يزداد الخطر المناخي؟
  const [m3Act2HighestRegion, setM3Act2HighestRegion] = useState('');
  const [m3Act2HighestReason, setM3Act2HighestReason] = useState('');
  const [m3Act2OtherRegion, setM3Act2OtherRegion] = useState('');
  const [m3Act2OtherRisk, setM3Act2OtherRisk] = useState('');
  const [m3Act2AdaptationMeasure, setM3Act2AdaptationMeasure] = useState('');

  // النشاط 3: تكيّف أم تخفيف؟
  const [m3Act3Rows, setM3Act3Rows] = useState<MitigationAdaptationItem[]>([
    { id: 1, measure: 'استخدام الطاقة الشمسية', type: '' },
    { id: 2, measure: 'ترشيد استهلاك المياه', type: '' },
    { id: 3, measure: 'زراعة الأشجار وزيادة الغطاء النباتي', type: '' },
    { id: 4, measure: 'استخدام وسائل النقل العامة', type: '' },
    { id: 5, measure: 'بناء حواجز للحماية من ارتفاع مستوى البحر', type: '' },
    { id: 6, measure: 'استخدام نظم ري حديثة وكفؤة', type: '' },
    { id: 7, measure: 'استخدام أجهزة موفرة للطاقة', type: '' },
    { id: 8, measure: 'تصميم مبانٍ مقاومة للحرارة', type: '' },
  ]);
  const [m3Act3ChosenMeasure, setM3Act3ChosenMeasure] = useState('');
  const [m3Act3ChosenReason, setM3Act3ChosenReason] = useState('');

  // =========================================================================
  // إجابات الموديول الرابع (الاستدامة البيئية وإدارة الموارد)
  // =========================================================================
  // النشاط 1: أيّهما أكثر استدامة؟
  const [m4Act1Region, setM4Act1Region] = useState('');
  const [m4Act1Evidence1, setM4Act1Evidence1] = useState('');
  const [m4Act1Evidence2, setM4Act1Evidence2] = useState('');
  const [m4Act1Evidence3, setM4Act1Evidence3] = useState('');
  const [m4Act1Improvement, setM4Act1Improvement] = useState('');

  // النشاط 2: أين نبدأ التدخل؟
  const [m4Act2PriorityRegion, setM4Act2PriorityRegion] = useState('');
  const [m4Act2Reason1, setM4Act2Reason1] = useState('');
  const [m4Act2Reason2, setM4Act2Reason2] = useState('');
  const [m4Act2Action1, setM4Act2Action1] = useState('');
  const [m4Act2Action2, setM4Act2Action2] = useState('');

  // النشاط 3: كيف نجعل الحي أكثر استدامة؟
  const [m4Act3Rows, setM4Act3Rows] = useState<NeighborhoodMeasureRow[]>([
    { id: 1, measure: '', location: '', reason: '' },
    { id: 2, measure: '', location: '', reason: '' },
    { id: 3, measure: '', location: '', reason: '' },
  ]);

  // تحديث بيانات جدول النشاط الثالث للموديول الرابع
  const handleM4Act3Change = (id: number, field: keyof NeighborhoodMeasureRow, val: string) => {
    setM4Act3Rows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  // حالات الإرسال والتحرير
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(!!existingSubmission);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(!existingSubmission);

  // تحديث خانة المكون في جدول النشاط الأول
  const handleM1ComponentChange = (id: number, val: string) => {
    setM1Act1Rows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, component: val } : row))
    );
  };

  // تحديث نوع المكون (طبيعي / بشري)
  const handleM1TypeChange = (id: number, val: 'طبيعي' | 'بشري') => {
    setM1Act1Rows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, type: val } : row))
    );
  };

  // تحديث تصنيف إجراءات النشاط الثالث للموديول الثالث (تكيف / تخفيف)
  const handleM3Act3TypeChange = (id: number, val: 'تكيف' | 'تخفيف') => {
    setM3Act3Rows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, type: row.type === val ? '' : val } : row))
    );
  };

  const currentActivity = resolvedActivities[activeActivityIndex] || resolvedActivities[0];

  // تحديد نوع الموديول والنشاط الحالي بدقة
  const isModule1 =
    moduleId === 'module-1' ||
    currentActivity.title.includes('مكونات البيئة') ||
    currentActivity.title.includes('تتركز المشكلة');

  const isModule2 =
    moduleId === 'module-2' ||
    currentActivity.title.includes('مسار التلوث') ||
    currentActivity.title.includes('مستويات التلوث') ||
    currentActivity.title.includes('المصنع');

  const isModule3 =
    moduleId === 'module-3' ||
    currentActivity.title.includes('ماذا تغيّر') ||
    currentActivity.title.includes('الخطر المناخي') ||
    currentActivity.title.includes('تكيّف أم تخفيف');

  const isModule4 =
    moduleId === 'module-4' ||
    currentActivity.title.includes('أكثر استدامة') ||
    currentActivity.title.includes('نبدأ التدخل') ||
    currentActivity.title.includes('كيف نجعل الحي');

  // أنشطة الموديول الأول:
  const isM1Act1 = isModule1 && (activeActivityIndex === 0 || currentActivity.title.includes('مكونات البيئة'));
  const isM1Act2 = isModule1 && (activeActivityIndex === 1 || currentActivity.title.includes('تتركز المشكلة'));
  const isM1Act3 = isModule1 && (activeActivityIndex === 2 || currentActivity.title.includes('الموقع الأنسب'));

  // أنشطة الموديول الثاني:
  const isM2Act1 = isModule2 && (activeActivityIndex === 0 || currentActivity.title.includes('مسار التلوث'));
  const isM2Act2 = isModule2 && (activeActivityIndex === 1 || currentActivity.title.includes('مستويات التلوث'));
  const isM2Act3 = isModule2 && (activeActivityIndex === 2 || currentActivity.title.includes('المصنع'));

  // أنشطة الموديول الثالث:
  const isM3Act1 = isModule3 && (activeActivityIndex === 0 || currentActivity.title.includes('ماذا تغيّر'));
  const isM3Act2 = isModule3 && (activeActivityIndex === 1 || currentActivity.title.includes('الخطر المناخي'));
  const isM3Act3 = isModule3 && (activeActivityIndex === 2 || currentActivity.title.includes('تكيّف أم تخفيف'));

  // أنشطة الموديول الرابع:
  const isM4Act1 = isModule4 && (activeActivityIndex === 0 || currentActivity.title.includes('أيّهما أكثر استدامة'));
  const isM4Act2 = isModule4 && (activeActivityIndex === 1 || currentActivity.title.includes('نبدأ التدخل'));
  const isM4Act3 = isModule4 && (activeActivityIndex === 2 || currentActivity.title.includes('كيف نجعل الحي'));

  // التحقق من تعبئة أي نشاط لإظهار مؤشر الإنجاز (علامة الصح) على زر التبويب
  const getActivityAnsweredState = (idx: number) => {
    if (isModule1) {
      if (idx === 0) return m1Act1Rows.some((r) => r.component.trim() !== '');
      if (idx === 1) return m1Act2Place.trim() !== '' || m1Act2Reason.trim() !== '';
      if (idx === 2) return m1Act3Location.trim() !== '' || m1Act3Reason1.trim() !== '';
    } else if (isModule2) {
      if (idx === 0)
        return (
          m2Act1Source.trim() !== '' ||
          m2Act1Pathway.trim() !== '' ||
          m2Act1AffectedArea.trim() !== ''
        );
      if (idx === 1)
        return (
          m2Act2HighestRegion.trim() !== '' ||
          m2Act2Reason1.trim() !== '' ||
          m2Act2CompSourcesA.trim() !== ''
        );
      if (idx === 2) return m2Act3Location.trim() !== '' || m2Act3Reason1.trim() !== '';
    } else if (isModule3) {
      if (idx === 0)
        return (
          m3Act1Change1.trim() !== '' ||
          m3Act1Change2.trim() !== '' ||
          m3Act1Change3.trim() !== '' ||
          m3Act1Explain.trim() !== '' ||
          m3Act1Impact.trim() !== ''
        );
      if (idx === 1)
        return (
          m3Act2HighestRegion.trim() !== '' ||
          m3Act2HighestReason.trim() !== '' ||
          m3Act2OtherRegion.trim() !== '' ||
          m3Act2OtherRisk.trim() !== '' ||
          m3Act2AdaptationMeasure.trim() !== ''
        );
      if (idx === 2)
        return (
          m3Act3Rows.some((r) => r.type !== '') ||
          m3Act3ChosenMeasure.trim() !== '' ||
          m3Act3ChosenReason.trim() !== ''
        );
    } else if (isModule4) {
      if (idx === 0)
        return (
          m4Act1Region.trim() !== '' ||
          m4Act1Evidence1.trim() !== '' ||
          m4Act1Improvement.trim() !== ''
        );
      if (idx === 1)
        return (
          m4Act2PriorityRegion.trim() !== '' ||
          m4Act2Reason1.trim() !== '' ||
          m4Act2Action1.trim() !== ''
        );
      if (idx === 2)
        return m4Act3Rows.some((r) => r.measure.trim() !== '' || r.location.trim() !== '');
    }
    return false;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsSubmitting(true);
    setStatusMessage(null);

    let hasAnyData = false;
    let formattedAnswer = `=== تقرير إجابات الأنشطة التطبيقية (${activityTitle || moduleId}) ===\n\n`;

    if (isModule1) {
      // 1. الموديول الأول - النشاط الأول
      const filledRows = m1Act1Rows.filter((r) => r.component.trim() !== '');
      if (filledRows.length > 0) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الأول: مكونات البيئة من حولي ---\n';
        m1Act1Rows.forEach((r) => {
          const comp = r.component.trim() || '(فارغ)';
          formattedAnswer += `${r.id}. المكون: ${comp} | النوع: ${r.type}\n`;
        });
        if (m1Act1Notes.trim()) {
          formattedAnswer += `ملاحظات الطالب: ${m1Act1Notes.trim()}\n`;
        }
        formattedAnswer += '\n';
      }

      // 2. الموديول الأول - النشاط الثاني
      if (m1Act2Place.trim() || m1Act2Reason.trim()) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الثاني: أين تتركز المشكلة البيئية؟ ---\n';
        formattedAnswer += `المكان الأكثر تعرضًا للتلوث: ${m1Act2Place.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `سبب الاختيار: ${m1Act2Reason.trim() || '(لم يُحدد)'}\n\n`;
      }

      // 3. الموديول الأول - النشاط الثالث
      if (m1Act3Location.trim() || m1Act3Reason1.trim() || m1Act3Reason2.trim()) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الثالث: اختر الموقع الأنسب (إنشاء حديقة عامة) ---\n';
        formattedAnswer += `الموقع الأنسب المقترح: ${m1Act3Location.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `السبب المكاني الأول (١): ${m1Act3Reason1.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `السبب المكاني الثاني (٢): ${m1Act3Reason2.trim() || '(لم يُحدد)'}\n\n`;
      }
    } else if (isModule2) {
      // 1. الموديول الثاني - النشاط الأول
      if (m2Act1Source.trim() || m2Act1Pathway.trim() || m2Act1AffectedArea.trim()) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الأول: تتبع مسار التلوث ---\n';
        formattedAnswer += `١. مصدر التلوث: ${m2Act1Source.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `٢. مسار انتقال التلوث: ${m2Act1Pathway.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `٣. المنطقة الأكثر تأثرًا: ${m2Act1AffectedArea.trim() || '(لم يُحدد)'}\n\n`;
      }

      // 2. الموديول الثاني - النشاط الثاني
      if (
        m2Act2HighestRegion ||
        m2Act2Reason1.trim() ||
        m2Act2Reason2.trim() ||
        m2Act2CompSourcesA.trim() ||
        m2Act2CompSourcesB.trim() ||
        m2Act2CompLandUseA.trim() ||
        m2Act2CompLandUseB.trim() ||
        m2Act2CompHumanActA.trim() ||
        m2Act2CompHumanActB.trim() ||
        m2Act2CompPollutionLevelA.trim() ||
        m2Act2CompPollutionLevelB.trim()
      ) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الثاني: قارن مستويات التلوث ---\n';
        formattedAnswer += 'جدول المقارنة بين المنطقتين (أ) و (ب):\n';
        formattedAnswer += `* مصادر التلوث: المنطقة (أ): ${m2Act2CompSourcesA.trim() || '-'} | المنطقة (ب): ${m2Act2CompSourcesB.trim() || '-'}\n`;
        formattedAnswer += `* استخدامات الأرض: المنطقة (أ): ${m2Act2CompLandUseA.trim() || '-'} | المنطقة (ب): ${m2Act2CompLandUseB.trim() || '-'}\n`;
        formattedAnswer += `* النشاط البشري: المنطقة (أ): ${m2Act2CompHumanActA.trim() || '-'} | المنطقة (ب): ${m2Act2CompHumanActB.trim() || '-'}\n`;
        formattedAnswer += `* مستوى التلوث: المنطقة (أ): ${m2Act2CompPollutionLevelA.trim() || '-'} | المنطقة (ب): ${m2Act2CompPollutionLevelB.trim() || '-'}\n`;
        formattedAnswer += `المنطقة الأعلى تلوثًا: ${m2Act2HighestRegion || '(لم تُحدد)'}\n`;
        formattedAnswer += `سبب الاختيار الأول (١): ${m2Act2Reason1.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `سبب الاختيار الثاني (٢): ${m2Act2Reason2.trim() || '(لم يُحدد)'}\n\n`;
      }

      // 3. الموديول الثاني - النشاط الثالث
      if (m2Act3Location || m2Act3Reason1.trim() || m2Act3Reason2.trim()) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الثالث: أين نضع المصنع؟ ---\n';
        formattedAnswer += `الموقع الأنسب المقترح: ${m2Act3Location || '(لم يُحدد)'}\n`;
        formattedAnswer += `السبب المكاني الأول (١): ${m2Act3Reason1.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `السبب المكاني الثاني (٢): ${m2Act3Reason2.trim() || '(لم يُحدد)'}\n\n`;
      }
    } else if (isModule3) {
      // 1. الموديول الثالث - النشاط الأول: ماذا تغيّر في المكان؟
      if (
        m3Act1Change1.trim() ||
        m3Act1Change2.trim() ||
        m3Act1Change3.trim() ||
        m3Act1Explain.trim() ||
        m3Act1Impact.trim()
      ) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الأول: ماذا تغيّر في المكان؟ ---\n';
        formattedAnswer += '١. التغيرات التي ظهرت في الصورة الحديثة (عام 2025) مقارنة بعام (2000):\n';
        if (m3Act1Change1.trim()) formattedAnswer += `   - التغير (١): ${m3Act1Change1.trim()}\n`;
        if (m3Act1Change2.trim()) formattedAnswer += `   - التغير (٢): ${m3Act1Change2.trim()}\n`;
        if (m3Act1Change3.trim()) formattedAnswer += `   - التغير (٣): ${m3Act1Change3.trim()}\n`;
        formattedAnswer += `٢. تفسير أحد التغيرات وسببه: ${m3Act1Explain.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `٣. الآثار المحتملة لاستمرار هذا التغير على المنطقة: ${m3Act1Impact.trim() || '(لم يُحدد)'}\n\n`;
      }

      // 2. الموديول الثالث - النشاط الثاني: أين يزداد الخطر المناخي؟
      if (
        m3Act2HighestRegion.trim() ||
        m3Act2HighestReason.trim() ||
        m3Act2OtherRegion.trim() ||
        m3Act2OtherRisk.trim() ||
        m3Act2AdaptationMeasure.trim()
      ) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الثاني: أين يزداد الخطر المناخي؟ ---\n';
        formattedAnswer += `١. المنطقة الأكثر تعرضًا لآثار التغير المناخي: ${m3Act2HighestRegion.trim() || '(لم تُحدد)'}\n`;
        formattedAnswer += `   سبب الاختيار (ولماذا): ${m3Act2HighestReason.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `٢. منطقة أخرى قد تتأثر: ${m3Act2OtherRegion.trim() || '(لم تُحدد)'}\n`;
        formattedAnswer += `   نوع الخطر المحتمل عليها: ${m3Act2OtherRisk.trim() || '(لم يُحدد)'}\n`;
        formattedAnswer += `٣. مقترح إجراء التكيف المناسب: ${m3Act2AdaptationMeasure.trim() || '(لم يُحدد)'}\n\n`;
      }

      // 3. الموديول الثالث - النشاط الثالث: تكيّف أم تخفيف؟
      const answeredM3Rows = m3Act3Rows.filter((r) => r.type !== '');
      if (
        answeredM3Rows.length > 0 ||
        m3Act3ChosenMeasure.trim() ||
        m3Act3ChosenReason.trim()
      ) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الثالث: تكيّف أم تخفيف؟ ---\n';
        formattedAnswer += 'جدول تصنيف الإجراءات (تكيّف / تخفيف):\n';
        m3Act3Rows.forEach((r) => {
          formattedAnswer += `* ${r.id}. ${r.measure}: ${r.type || '(لم يُصنف)'}\n`;
        });
        if (m3Act3ChosenMeasure.trim() || m3Act3ChosenReason.trim()) {
          formattedAnswer += `الإجراء الأنسب المختار لمواجهة مشكلة مناخية: ${m3Act3ChosenMeasure.trim() || '(لم يُحدد)'}\n`;
          formattedAnswer += `سبب وتفسير الاختيار: ${m3Act3ChosenReason.trim() || '(لم يُحدد)'}\n`;
        }
        formattedAnswer += '\n';
      }
    } else if (isModule4) {
      // 1. الموديول الرابع - النشاط الأول: أيّهما أكثر استدامة؟
      if (
        m4Act1Region.trim() ||
        m4Act1Evidence1.trim() ||
        m4Act1Evidence2.trim() ||
        m4Act1Evidence3.trim() ||
        m4Act1Improvement.trim()
      ) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الأول: أيّهما أكثر استدامة؟ ---\n';
        formattedAnswer += `١. المنطقة الأكثر استدامة: ${m4Act1Region.trim() || '(لم تُحدد)'}\n`;
        formattedAnswer += '٢. الأدلة من الجدول:\n';
        if (m4Act1Evidence1.trim()) formattedAnswer += `   - الدليل (١): ${m4Act1Evidence1.trim()}\n`;
        if (m4Act1Evidence2.trim()) formattedAnswer += `   - الدليل (٢): ${m4Act1Evidence2.trim()}\n`;
        if (m4Act1Evidence3.trim()) formattedAnswer += `   - الدليل (٣): ${m4Act1Evidence3.trim()}\n`;
        formattedAnswer += `٣. مقترحات تحسين استدامة المنطقة الأقل استدامة: ${m4Act1Improvement.trim() || '(لم يُحدد)'}\n\n`;
      }

      // 2. الموديول الرابع - النشاط الثاني: أين نبدأ التدخل؟
      if (
        m4Act2PriorityRegion.trim() ||
        m4Act2Reason1.trim() ||
        m4Act2Reason2.trim() ||
        m4Act2Action1.trim() ||
        m4Act2Action2.trim()
      ) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الثاني: أين نبدأ التدخل؟ ---\n';
        formattedAnswer += `١. المنطقة ذات الأولوية للتدخل: ${m4Act2PriorityRegion.trim() || '(لم تُحدد)'}\n`;
        formattedAnswer += '٢. سببا الاختيار:\n';
        if (m4Act2Reason1.trim()) formattedAnswer += `   - السبب الأول (١): ${m4Act2Reason1.trim()}\n`;
        if (m4Act2Reason2.trim()) formattedAnswer += `   - السبب الثاني (٢): ${m4Act2Reason2.trim()}\n`;
        formattedAnswer += '٣. الإجراءان المقترحان لمعالجة المشكلة:\n';
        if (m4Act2Action1.trim()) formattedAnswer += `   - الإجراء الأول (١): ${m4Act2Action1.trim()}\n`;
        if (m4Act2Action2.trim()) formattedAnswer += `   - الإجراء الثاني (٢): ${m4Act2Action2.trim()}\n\n`;
      }

      // 3. الموديول الرابع - النشاط الثالث: كيف نجعل الحي أكثر استدامة؟
      const filledM4Rows = m4Act3Rows.filter((r) => r.measure.trim() !== '' || r.location.trim() !== '');
      if (filledM4Rows.length > 0) {
        hasAnyData = true;
        formattedAnswer += '--- النشاط الثالث: كيف نجعل الحي أكثر استدامة؟ ---\n';
        formattedAnswer += 'جدول إجراءات تحسين استدامة الحي والمواقع المقترحة:\n';
        m4Act3Rows.forEach((r) => {
          if (r.measure.trim() || r.location.trim() || r.reason.trim()) {
            formattedAnswer += `* م ${r.id}: الإجراء: ${r.measure.trim() || '-'} | المكان الأنسب: ${r.location.trim() || '-'} | سبب الاختيار: ${r.reason.trim() || '-'}\n`;
          }
        });
        formattedAnswer += '\n';
      }
    }

    if (!hasAnyData) {
      setIsSubmitting(false);
      setStatusMessage({
        type: 'error',
        text: 'يرجى كتابة إجابات الأنشطة في الخانات المخصصة قبل تسليم النشاط.',
      });
      return;
    }

    const res = await submitModuleActivityAction(moduleId, formattedAnswer);
    setIsSubmitting(false);

    if (res.success) {
      setHasSubmitted(true);
      setStatusMessage({
        type: 'success',
        text: 'تم تسليم إجابات الأنشطة التطبيقية بنجاح وحفظها في سجلك الأكاديمي!',
      });
      setIsEditing(false);
      if (onActivityCompleted) {
        onActivityCompleted();
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'حدث خطأ أثناء حفظ إجابة النشاط، يرجى المحاولة ثانية',
      });
    }
  };

  return (
    <div className="w-full space-y-6 text-right select-none animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* شريط أزرار التنقل السريعة والواضحة بين الأنشطة الثلاثة                     */}
      {/* ========================================================================= */}
      {resolvedActivities.length > 1 && (
        <div className="bg-white p-3 sm:p-4 rounded-3xl border-2 border-asu-gold/40 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs sm:text-sm font-black text-asu-navy flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-asu-gold-dark" />
              <span>اختر النشاط للحل والمعاينة:</span>
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              النشاط {activeActivityIndex + 1} من {resolvedActivities.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {resolvedActivities.map((act, idx) => {
              const isActive = activeActivityIndex === idx;
              const isDone = getActivityAnsweredState(idx);

              const parts = act.title.split(':');
              const mainName = parts[0]?.trim() || `النشاط ${idx + 1}`;
              const subName = parts[1]?.trim() || act.title;

              return (
                <button
                  key={act.id || idx}
                  type="button"
                  onClick={() => setActiveActivityIndex(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-between gap-3 text-right ${
                    isActive
                      ? 'bg-asu-navy text-white border-2 border-asu-gold shadow-md ring-2 ring-asu-gold/40'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isActive
                          ? 'bg-asu-gold text-slate-950 shadow-sm'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 truncate">
                      <span
                        className={`block text-xs sm:text-sm font-black truncate ${
                          isActive ? 'text-asu-gold' : 'text-asu-navy'
                        }`}
                      >
                        {mainName}
                      </span>
                      <span
                        className={`block text-[11px] truncate font-medium mt-0.5 ${
                          isActive ? 'text-slate-200' : 'text-slate-500'
                        }`}
                      >
                        {subName}
                      </span>
                    </div>
                  </div>

                  {isDone && (
                    <span
                      className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs"
                      title="تمت الإجابة"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* بطاقة النشاط الرئيسي                                                        */}
      {/* ========================================================================= */}
      <Card className="border-2 border-asu-gold/40 shadow-xl bg-white rounded-3xl overflow-hidden">
        {/* ترويسة النشاط */}
        <CardHeader className="bg-gradient-to-r from-asu-navy/10 via-asu-gold/10 to-transparent border-b border-asu-gold/20 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-asu-gold/20 text-asu-gold-dark border border-asu-gold/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-asu-gold-dark" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="gold" className="text-[10px] sm:text-xs font-bold">
                    النشاط التطبيقي {resolvedActivities.length > 1 ? `(${activeActivityIndex + 1} من ${resolvedActivities.length})` : ''}
                  </Badge>
                  {hasSubmitted && !isEditing && (
                    <Badge variant="success" className="gap-1 text-[10px] sm:text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم تسليم النشاط بنجاح</span>
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg sm:text-xl font-black text-asu-navy mt-1">
                  {currentActivity.title}
                </CardTitle>
              </div>
            </div>

            {hasSubmitted && !isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1.5 text-xs border-asu-gold text-asu-navy hover:bg-asu-gold/10 font-bold self-start sm:self-center cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>تعديل إجابات الأنشطة</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-8 space-y-6">
          {/* نص تعليمات وهدف النشاط */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-asu-navy font-bold text-xs sm:text-sm">
              <HelpCircle className="w-4 h-4 text-asu-gold-dark" />
              <span>تعليمات وهدف النشاط:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
              {currentActivity.description}
            </p>
          </div>

          {/* صورة ورقة النشاط بنسبة 16:9 مطابقة لحجم الموديول */}
          {currentActivity.imageUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>ورقة النشاط التطبيقي والخريطة:</span>
                <button
                  type="button"
                  onClick={() => setFullscreenImageUrl(currentActivity.imageUrl!)}
                  className="inline-flex items-center gap-1 text-[11px] text-asu-navy hover:text-asu-navy-light cursor-pointer font-bold"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-asu-gold-dark" />
                  <span>تكبير ورقة النشاط والخريطة</span>
                </button>
              </div>

              <div
                className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border-2 border-asu-gold/40 shadow-xl group cursor-pointer flex items-center justify-center"
                onClick={() => setFullscreenImageUrl(currentActivity.imageUrl!)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentActivity.imageUrl}
                  alt={currentActivity.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-black/75 text-white text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-xs flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-asu-gold" />
                    <span>انقر لتكبير ورقة النشاط والخريطة</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* إشعار الحالة إن وجد */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* نماذج إدخال الإجابات المخصصة لكل نشاط من الأنشطة                           */}
          {/* ========================================================================= */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* =================================================================== */}
              {/* نماذج الموديول الأول                                                */}
              {/* =================================================================== */}

              {/* الموديول 1 - النشاط 1: جدول مكونات البيئة من حولي */}
              {isM1Act1 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>حدّد ثلاثة مكونات طبيعية وثلاثة مكونات بشرية وفق الجدول التالي:</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800">
                      <TableIcon className="w-4 h-4 text-asu-gold-dark" />
                      <span>جدول رصد المكونات البيئية:</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                      <table className="w-full text-right text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-asu-navy text-white text-xs font-black">
                            <th className="p-3 w-12 text-center">م</th>
                            <th className="p-3">اسم المكوّن في البيئة المحيطة</th>
                            <th className="p-3 w-40 text-center">نوع المكوّن</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {m1Act1Rows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 text-center font-bold font-mono text-slate-600 bg-slate-50/50">
                                {row.id}
                              </td>
                              <td className="p-2.5 sm:p-3">
                                <input
                                  type="text"
                                  value={row.component}
                                  onChange={(e) => handleM1ComponentChange(row.id, e.target.value)}
                                  placeholder="اكتب اسم المكوّن..."
                                  disabled={isSubmitting}
                                  className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                                />
                              </td>
                              <td className="p-2.5 sm:p-3 text-center">
                                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                                  <button
                                    type="button"
                                    onClick={() => handleM1TypeChange(row.id, 'طبيعي')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      row.type === 'طبيعي'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    طبيعي
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleM1TypeChange(row.id, 'بشري')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      row.type === 'بشري'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    بشري
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      ملاحظات أو تعليق إضافي حول التوزيع والعلاقات المكانية بين هذه المكونات:
                    </label>
                    <textarea
                      value={m1Act1Notes}
                      onChange={(e) => setM1Act1Notes(e.target.value)}
                      placeholder="اكتب ملاحظاتك أو تحليلك هنا..."
                      rows={2}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed font-medium"
                    />
                  </div>
                </div>
              )}

              {/* الموديول 1 - النشاط 2: أين تتركز المشكلة البيئية؟ */}
              {isM1Act2 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>حدّد المكان المتوقع أن يكون أكثر تعرضًا للتلوث، ثم فسّر اختيارك:</span>
                  </div>

                  {/* 1. المكان الأكثر تعرضًا للتلوث */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ١
                      </span>
                      <span>المكان الأكثر تعرضًا للتلوث: <span className="text-rose-500">*</span></span>
                    </label>

                    <input
                      type="text"
                      value={m1Act2Place}
                      onChange={(e) => setM1Act2Place(e.target.value)}
                      placeholder="اكتب المكان المتوقع أن يكون أكثر تعرضًا للتلوث..."
                      disabled={isSubmitting}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                    />
                  </div>

                  {/* 2. سبب الاختيار */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٢
                      </span>
                      <span>سبب الاختيار (فسّر اختيارك مكانيًا): <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      value={m1Act2Reason}
                      onChange={(e) => setM1Act2Reason(e.target.value)}
                      placeholder="اكتب تفسيرك وسبب اختيارك مكانيًا..."
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed font-medium"
                    />
                  </div>
                </div>
              )}

              {/* الموديول 1 - النشاط 3: اختر الموقع الأنسب (إنشاء حديقة عامة) */}
              {isM1Act3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>قارن بين المواقع الثلاثة المقترحة لإنشاء حديقة عامة، ثم اختر الأنسب واذكر سببين مكانيين:</span>
                  </div>

                  {/* 1. اختيار الموقع الأنسب */}
                  <div className="space-y-2.5">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-asu-gold-dark" />
                      <span>أولاً: اختر الموقع الأنسب لإنشاء الحديقة العامة: <span className="text-rose-500">*</span></span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'الموقع (1)', label: 'الموقع (1)' },
                        { id: 'الموقع (2)', label: 'الموقع (2)' },
                        { id: 'الموقع (3)', label: 'الموقع (3)' },
                      ].map((site) => {
                        const isSelected = m1Act3Location === site.id;
                        return (
                          <button
                            key={site.id}
                            type="button"
                            onClick={() => setM1Act3Location(site.id)}
                            className={`p-4 rounded-2xl font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-2 border-2 ${
                              isSelected
                                ? 'bg-asu-navy text-asu-gold border-asu-gold shadow-md ring-2 ring-asu-gold/30'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`text-sm sm:text-base font-black ${
                                isSelected ? 'text-asu-gold' : 'text-asu-navy'
                              }`}
                            >
                              {site.label}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-asu-gold" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. سببي الاختيار */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800">
                      ثانيًا: سببي الاختيار (اذكر سببين مكانيين يفسران اختيار هذا الموقع): <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                          ١
                        </span>
                        <input
                          type="text"
                          value={m1Act3Reason1}
                          onChange={(e) => setM1Act3Reason1(e.target.value)}
                          placeholder="اكتب السبب المكاني الأول..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                          ٢
                        </span>
                        <input
                          type="text"
                          value={m1Act3Reason2}
                          onChange={(e) => setM1Act3Reason2(e.target.value)}
                          placeholder="اكتب السبب المكاني الثاني..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* نماذج الموديول الثاني                                                */}
              {/* =================================================================== */}

              {/* الموديول 2 - النشاط 1: تتبع مسار التلوث */}
              {isM2Act1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>أجب عن الأسئلة الثلاثة التالية وفق الخريطة الموضحة أعلاه:</span>
                  </div>

                  {/* 1. مصدر التلوث */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ١
                      </span>
                      <span>مصدر التلوث: <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={m2Act1Source}
                      onChange={(e) => setM2Act1Source(e.target.value)}
                      placeholder="اكتب مصدر التلوث من الخريطة..."
                      disabled={isSubmitting}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                    />
                  </div>

                  {/* 2. مسار انتقال التلوث */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٢
                      </span>
                      <span>مسار انتقال التلوث: <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={m2Act1Pathway}
                      onChange={(e) => setM2Act1Pathway(e.target.value)}
                      placeholder="اكتب مسار انتقال التلوث..."
                      disabled={isSubmitting}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                    />
                  </div>

                  {/* 3. المنطقة الأكثر تأثرًا */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٣
                      </span>
                      <span>المنطقة الأكثر تأثرًا: <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={m2Act1AffectedArea}
                      onChange={(e) => setM2Act1AffectedArea(e.target.value)}
                      placeholder="اكتب المنطقة الأكثر تأثرًا مع التعليل..."
                      disabled={isSubmitting}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                    />
                  </div>
                </div>
              )}

              {/* الموديول 2 - النشاط 2: قارن مستويات التلوث */}
              {isM2Act2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800">
                      <TableIcon className="w-4 h-4 text-asu-gold-dark" />
                      <span>أولاً: جدول المقارنة بين المنطقتين (أ) و (ب):</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                      <table className="w-full text-right text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-asu-navy text-white text-xs font-black">
                            <th className="p-3 w-1/4 text-center border-l border-white/10">وجه المقارنة</th>
                            <th className="p-3 w-[37.5%] text-center border-l border-white/10 bg-amber-950/40">
                              المنطقة ( أ )
                            </th>
                            <th className="p-3 w-[37.5%] text-center bg-emerald-950/40">
                              المنطقة ( ب )
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-black text-slate-800 bg-slate-50/70 border-l border-slate-100 text-center">
                              مصادر التلوث
                            </td>
                            <td className="p-2.5 border-l border-slate-100">
                              <input
                                type="text"
                                value={m2Act2CompSourcesA}
                                onChange={(e) => setM2Act2CompSourcesA(e.target.value)}
                                placeholder="اكتب مصادر التلوث في (أ)..."
                                disabled={isSubmitting}
                                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={m2Act2CompSourcesB}
                                onChange={(e) => setM2Act2CompSourcesB(e.target.value)}
                                placeholder="اكتب مصادر التلوث في (ب)..."
                                disabled={isSubmitting}
                                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                              />
                            </td>
                          </tr>

                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-black text-slate-800 bg-slate-50/70 border-l border-slate-100 text-center">
                              استخدامات الأرض
                            </td>
                            <td className="p-2.5 border-l border-slate-100">
                              <input
                                type="text"
                                value={m2Act2CompLandUseA}
                                onChange={(e) => setM2Act2CompLandUseA(e.target.value)}
                                placeholder="استخدامات الأرض في (أ)..."
                                disabled={isSubmitting}
                                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={m2Act2CompLandUseB}
                                onChange={(e) => setM2Act2CompLandUseB(e.target.value)}
                                placeholder="استخدامات الأرض في (ب)..."
                                disabled={isSubmitting}
                                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                              />
                            </td>
                          </tr>

                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-black text-slate-800 bg-slate-50/70 border-l border-slate-100 text-center">
                              النشاط البشري
                            </td>
                            <td className="p-2.5 border-l border-slate-100">
                              <input
                                type="text"
                                value={m2Act2CompHumanActA}
                                onChange={(e) => setM2Act2CompHumanActA(e.target.value)}
                                placeholder="النشاط البشري في (أ)..."
                                disabled={isSubmitting}
                                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={m2Act2CompHumanActB}
                                onChange={(e) => setM2Act2CompHumanActB(e.target.value)}
                                placeholder="النشاط البشري في (ب)..."
                                disabled={isSubmitting}
                                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                              />
                            </td>
                          </tr>

                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-black text-slate-800 bg-slate-50/70 border-l border-slate-100 text-center">
                              مستوى التلوث
                            </td>
                            <td className="p-2.5 border-l border-slate-100">
                              <input
                                type="text"
                                value={m2Act2CompPollutionLevelA}
                                onChange={(e) => setM2Act2CompPollutionLevelA(e.target.value)}
                                placeholder="مستوى التلوث في (أ)..."
                                disabled={isSubmitting}
                                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={m2Act2CompPollutionLevelB}
                                onChange={(e) => setM2Act2CompPollutionLevelB(e.target.value)}
                                placeholder="مستوى التلوث في (ب)..."
                                disabled={isSubmitting}
                                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-asu-gold-dark" />
                      <span>ثانيًا: حدّد المنطقة الأعلى تلوثًا: <span className="text-rose-500">*</span></span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      {['المنطقة ( أ )', 'المنطقة ( ب )'].map((reg) => {
                        const isSelected = m2Act2HighestRegion === reg;
                        return (
                          <button
                            key={reg}
                            type="button"
                            onClick={() => setM2Act2HighestRegion(reg)}
                            className={`p-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border-2 ${
                              isSelected
                                ? 'bg-asu-navy text-asu-gold border-asu-gold shadow-md ring-2 ring-asu-gold/30'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-asu-gold" />}
                            <span>{reg}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800">
                      ثالثًا: سبب الاختيار (اذكر سببين يفسران اختيارك): <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                          ١
                        </span>
                        <input
                          type="text"
                          value={m2Act2Reason1}
                          onChange={(e) => setM2Act2Reason1(e.target.value)}
                          placeholder="اكتب السبب الأول..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                          ٢
                        </span>
                        <input
                          type="text"
                          value={m2Act2Reason2}
                          onChange={(e) => setM2Act2Reason2(e.target.value)}
                          placeholder="اكتب السبب الثاني..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* الموديول 2 - النشاط 3: أين نضع المصنع؟ */}
              {isM2Act3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="space-y-2.5">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-asu-gold-dark" />
                      <span>أولاً: اختر الموقع الأنسب لإنشاء المصنع (الأقل تأثيرًا في السكان والبيئة): <span className="text-rose-500">*</span></span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'الموقع (A)', label: 'الموقع (A)' },
                        { id: 'الموقع (B)', label: 'الموقع (B)' },
                        { id: 'الموقع (C)', label: 'الموقع (C)' },
                      ].map((site) => {
                        const isSelected = m2Act3Location === site.id;
                        return (
                          <button
                            key={site.id}
                            type="button"
                            onClick={() => setM2Act3Location(site.id)}
                            className={`p-4 rounded-2xl font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-2 border-2 ${
                              isSelected
                                ? 'bg-asu-navy text-white border-asu-gold shadow-md ring-2 ring-asu-gold/30'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`text-sm sm:text-base font-black ${
                                isSelected ? 'text-asu-gold' : 'text-asu-navy'
                              }`}
                            >
                              {site.label}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-asu-gold" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800">
                      ثانيًا: سببي الاختيار (اذكر سببين مكانيين يفسران اختيار هذا الموقع): <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                          ١
                        </span>
                        <input
                          type="text"
                          value={m2Act3Reason1}
                          onChange={(e) => setM2Act3Reason1(e.target.value)}
                          placeholder="اكتب السبب المكاني الأول..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                          ٢
                        </span>
                        <input
                          type="text"
                          value={m2Act3Reason2}
                          onChange={(e) => setM2Act3Reason2(e.target.value)}
                          placeholder="اكتب السبب المكاني الثاني..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* نماذج الموديول الثالث                                               */}
              {/* =================================================================== */}

              {/* الموديول 3 - النشاط 1: ماذا تغيّر في المكان؟ */}
              {isM3Act1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>تأمل الصورتين للمكان نفسه (عام 2000 في الماضي وعام 2025 في الوقت الحاضر)، ثم أجب:</span>
                  </div>

                  {/* 1. اذكر ثلاث تغيرات ظهرت في الصورة الحديثة */}
                  <div className="space-y-3">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ١
                      </span>
                      <span>اذكر ثلاث تغيرات ظهرت في الصورة الحديثة (عام 2025) مقارنة بالصورة القديمة (عام 2000): <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ١
                        </span>
                        <input
                          type="text"
                          value={m3Act1Change1}
                          onChange={(e) => setM3Act1Change1(e.target.value)}
                          placeholder="اكتب التغير الأول الملاحظ..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ٢
                        </span>
                        <input
                          type="text"
                          value={m3Act1Change2}
                          onChange={(e) => setM3Act1Change2(e.target.value)}
                          placeholder="اكتب التغير الثاني الملاحظ..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ٣
                        </span>
                        <input
                          type="text"
                          value={m3Act1Change3}
                          onChange={(e) => setM3Act1Change3(e.target.value)}
                          placeholder="اكتب التغير الثالث الملاحظ..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. اختر أحد هذه التغيرات وفسر سببه */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٢
                      </span>
                      <span>اختر أحد هذه التغيرات وفسّر سببه: <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      value={m3Act1Explain}
                      onChange={(e) => setM3Act1Explain(e.target.value)}
                      placeholder="اختر أحد التغيرات السابقة وفسّر سبب حدوثه مكانيًا وبيئيًا..."
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed font-medium"
                    />
                  </div>

                  {/* 3. ما الآثار المحتملة لاستمرار هذا التغير على المنطقة؟ */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٣
                      </span>
                      <span>ما الآثار المحتملة لاستمرار هذا التغير على المنطقة؟ <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      value={m3Act1Impact}
                      onChange={(e) => setM3Act1Impact(e.target.value)}
                      placeholder="اكتب توقعاتك للآثار المحتملة على السكان والموارد الطبيعية والبيئة..."
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed font-medium"
                    />
                  </div>
                </div>
              )}

              {/* الموديول 3 - النشاط 2: أين يزداد الخطر المناخي؟ */}
              {isM3Act2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>تأمل الخريطة التي توضح أربع مناطق في مصر (الساحلية، الحضرية، الزراعية، الجبلية الجافة) والأخطار المناخية:</span>
                  </div>

                  {/* 1. أي منطقة تتوقع أنها الأكثر تعرضاً لآثار التغير المناخي؟ ولماذا؟ */}
                  <div className="space-y-3">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ١
                      </span>
                      <span>أي منطقة تتوقع أنها الأكثر تعرضاً لآثار التغير المناخي؟ ولماذا؟ <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {[
                        { id: 'المنطقة (أ) - منطقة ساحلية', label: 'المنطقة ( أ )', sub: 'منطقة ساحلية' },
                        { id: 'المنطقة (ب) - منطقة حضرية', label: 'المنطقة ( ب )', sub: 'منطقة حضرية' },
                        { id: 'المنطقة (ج) - منطقة زراعية', label: 'المنطقة ( ج )', sub: 'منطقة زراعية' },
                        { id: 'المنطقة (د) - منطقة جبلية جافة', label: 'المنطقة ( د )', sub: 'منطقة جبلية جافة' },
                      ].map((reg) => {
                        const isSelected = m3Act2HighestRegion === reg.id;
                        return (
                          <button
                            key={reg.id}
                            type="button"
                            onClick={() => setM3Act2HighestRegion(reg.id)}
                            className={`p-3.5 rounded-2xl font-bold transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 border-2 ${
                              isSelected
                                ? 'bg-asu-navy text-white border-asu-gold shadow-md ring-2 ring-asu-gold/30'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs sm:text-sm font-black ${isSelected ? 'text-asu-gold' : 'text-asu-navy'}`}>
                                {reg.label}
                              </span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-asu-gold" />}
                            </div>
                            <span className={`text-[11px] font-medium ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                              {reg.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <textarea
                      value={m3Act2HighestReason}
                      onChange={(e) => setM3Act2HighestReason(e.target.value)}
                      placeholder="ولماذا؟ اكتب تفسيرك وسبب اختيارك لهذه المنطقة تحديدًا..."
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed font-medium"
                    />
                  </div>

                  {/* 2. اذكر منطقة أخرى قد تتأثر بالتغيرات المناخية وحدد نوع الخطر المحتمل عليها */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٢
                      </span>
                      <span>اذكر منطقة أخرى قد تتأثر بالتغيرات المناخية وحدد نوع الخطر المحتمل عليها: <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="block text-xs font-bold text-slate-600 mb-1.5">اسم المنطقة الأخرى:</span>
                        <input
                          type="text"
                          value={m3Act2OtherRegion}
                          onChange={(e) => setM3Act2OtherRegion(e.target.value)}
                          placeholder="اكتب اسم المنطقة الأخرى من الخريطة..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-600 mb-1.5">نوع الخطر المحتمل عليها:</span>
                        <input
                          type="text"
                          value={m3Act2OtherRisk}
                          onChange={(e) => setM3Act2OtherRisk(e.target.value)}
                          placeholder="حدد نوع الخطر المحتمل (مثلاً: جفاف، فيضانات، حرارة...)..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. اقترح إجراءً مناسباً للتكيف مع هذا الخطر في المنطقة التي اخترتها */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٣
                      </span>
                      <span>اقترح إجراءً مناسباً للتكيف مع هذا الخطر في المنطقة التي اخترتها: <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      value={m3Act2AdaptationMeasure}
                      onChange={(e) => setM3Act2AdaptationMeasure(e.target.value)}
                      placeholder="اكتب مقترحك العملي المناسب للتكيف مع الخطر في هذه المنطقة..."
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed font-medium"
                    />
                  </div>
                </div>
              )}

              {/* الموديول 3 - النشاط 3: تكيّف أم تخفيف؟ */}
              {isM3Act3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>صنف كل إجراء من الإجراءات الثمانية إلى (تكيّف) أو (تخفيف) عبر النقر على التصنيف المناسب:</span>
                  </div>

                  {/* جدول التصنيف */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800">
                      <TableIcon className="w-4 h-4 text-asu-gold-dark" />
                      <span>جدول تصنيف الإجراءات (تكيّف / تخفيف):</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                      <table className="w-full text-right text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-asu-navy text-white text-xs font-black">
                            <th className="p-3 w-14 text-center">رقم الإجراء</th>
                            <th className="p-3">الإجراء</th>
                            <th className="p-3 w-48 text-center">التصنيف (تكيف / تخفيف)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {m3Act3Rows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 text-center font-black text-slate-700 bg-slate-50/60 border-l border-slate-100">
                                {row.id}
                              </td>
                              <td className="p-3 font-bold text-slate-800 border-l border-slate-100">
                                {row.measure}
                              </td>
                              <td className="p-2.5 text-center">
                                <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleM3Act3TypeChange(row.id, 'تكيف')}
                                    disabled={isSubmitting}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      row.type === 'تكيف'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                    }`}
                                  >
                                    تكيّف
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleM3Act3TypeChange(row.id, 'تخفيف')}
                                    disabled={isSubmitting}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      row.type === 'تخفيف'
                                        ? 'bg-asu-navy text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                    }`}
                                  >
                                    تخفيف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* تطبيق إضافي: اختيار الإجراء الأنسب لمواجهة مشكلة مناخية في منطقة محددة */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-asu-gold-dark" />
                      <span>تطبيق: اختر الإجراء الأنسب لمواجهة مشكلة مناخية في منطقة محددة: <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="space-y-3">
                      <div>
                        <span className="block text-xs font-bold text-slate-600 mb-1.5">الإجراء والمشكلة المناخية:</span>
                        <input
                          type="text"
                          value={m3Act3ChosenMeasure}
                          onChange={(e) => setM3Act3ChosenMeasure(e.target.value)}
                          placeholder="مثلاً: الإجراء الأنسب لمواجهة ارتفاع درجات الحرارة في المدينة أو الجفاف..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-600 mb-1.5">سبب اختيارك لهذا الإجراء (فسر اختيارك):</span>
                        <textarea
                          value={m3Act3ChosenReason}
                          onChange={(e) => setM3Act3ChosenReason(e.target.value)}
                          placeholder="اكتب تفسيرك وسبب اختيار هذا الإجراء كحل أمثل..."
                          rows={3}
                          disabled={isSubmitting}
                          className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* نماذج الموديول الرابع                                               */}
              {/* =================================================================== */}

              {/* الموديول 4 - النشاط 1: أيّهما أكثر استدامة؟ */}
              {isM4Act1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>تأمل البيانات والصور في المنطقتين (استخدام المياه، الطاقة، إدارة المخلفات، المساحات الخضراء)، ثم أجب:</span>
                  </div>

                  {/* 1. أي المنطقتين أكثر استدامة؟ */}
                  <div className="space-y-3">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ١
                      </span>
                      <span>أيّ المنطقتين أكثر استدامة؟ <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'المنطقة الأولى (الريفية / الخضراء المستدامة)', label: 'المنطقة الأولى (الريفية / الخضراء)', sub: 'طاقة متجددة وترشيد مياه ومساحات خضراء' },
                        { id: 'المنطقة الثانية (الحضرية كثيفة المباني)', label: 'المنطقة الثانية (الحضرية)', sub: 'اعتماد على الوقود واستهلاك مرتفع للمياه' },
                      ].map((reg) => {
                        const isSelected = m4Act1Region === reg.id;
                        return (
                          <button
                            key={reg.id}
                            type="button"
                            onClick={() => setM4Act1Region(reg.id)}
                            className={`p-4 rounded-2xl font-bold transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 border-2 ${
                              isSelected
                                ? 'bg-asu-navy text-white border-asu-gold shadow-md ring-2 ring-asu-gold/30'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs sm:text-sm font-black ${isSelected ? 'text-asu-gold' : 'text-asu-navy'}`}>
                                {reg.label}
                              </span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-asu-gold" />}
                            </div>
                            <span className={`text-[11px] font-medium ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                              {reg.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. اذكر ثلاثة أدلة من الجدول تدعم اختيارك */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٢
                      </span>
                      <span>اذكر ثلاثة أدلة من الجدول تدعم اختيارك: <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ١
                        </span>
                        <input
                          type="text"
                          value={m4Act1Evidence1}
                          onChange={(e) => setM4Act1Evidence1(e.target.value)}
                          placeholder="اكتب الدليل الأول من الجدول..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ٢
                        </span>
                        <input
                          type="text"
                          value={m4Act1Evidence2}
                          onChange={(e) => setM4Act1Evidence2(e.target.value)}
                          placeholder="اكتب الدليل الثاني من الجدول..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ٣
                        </span>
                        <input
                          type="text"
                          value={m4Act1Evidence3}
                          onChange={(e) => setM4Act1Evidence3(e.target.value)}
                          placeholder="اكتب الدليل الثالث من الجدول..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. وضح كيف يمكن تحسين استدامة المنطقة الأقل استدامة */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٣
                      </span>
                      <span>وضّح كيف يمكن تحسين استدامة المنطقة الأقل استدامة: <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      value={m4Act1Improvement}
                      onChange={(e) => setM4Act1Improvement(e.target.value)}
                      placeholder="اكتب مقترحات عملية لتحسين استدامة هذه المنطقة (في مجالات المياه، الطاقة، المخلفات، والمساحات الخضراء)..."
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed font-medium"
                    />
                  </div>
                </div>
              )}

              {/* الموديول 4 - النشاط 2: أين نبدأ التدخل؟ */}
              {isM4Act2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>تأمل الخريطة والبيانات الواردة في الجدول لمقارنة المناطق الثلاث (أ، ب، ج)، ثم أجب:</span>
                  </div>

                  {/* 1. ما المنطقة ذات الأولوية للتدخل؟ */}
                  <div className="space-y-3">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ١
                      </span>
                      <span>ما المنطقة ذات الأولوية للتدخل؟ <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'المنطقة (أ)', label: 'المنطقة ( أ )', sub: '500 ألف نسمة | تلوث هواء وماء وصرف | شدة مرتفعة' },
                        { id: 'المنطقة (ب)', label: 'المنطقة ( ب )', sub: '250 ألف نسمة | نقص مياه وتدهور تربة | شدة متوسطة' },
                        { id: 'المنطقة (ج)', label: 'المنطقة ( ج )', sub: '80 ألف نسمة | تصحر وعواصف ترابية | شدة متوسطة' },
                      ].map((reg) => {
                        const isSelected = m4Act2PriorityRegion === reg.id;
                        return (
                          <button
                            key={reg.id}
                            type="button"
                            onClick={() => setM4Act2PriorityRegion(reg.id)}
                            className={`p-4 rounded-2xl font-bold transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 border-2 ${
                              isSelected
                                ? 'bg-asu-navy text-white border-asu-gold shadow-md ring-2 ring-asu-gold/30'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs sm:text-sm font-black ${isSelected ? 'text-asu-gold' : 'text-asu-navy'}`}>
                                {reg.label}
                              </span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-asu-gold" />}
                            </div>
                            <span className={`text-[11px] font-medium leading-snug ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                              {reg.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. اذكر سببين لإختيارك لهذه المنطقة */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٢
                      </span>
                      <span>اذكر سببين لإختيارك لهذه المنطقة: <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ١
                        </span>
                        <input
                          type="text"
                          value={m4Act2Reason1}
                          onChange={(e) => setM4Act2Reason1(e.target.value)}
                          placeholder="اكتب السبب الأول لاختيار هذه المنطقة كأولوية..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ٢
                        </span>
                        <input
                          type="text"
                          value={m4Act2Reason2}
                          onChange={(e) => setM4Act2Reason2(e.target.value)}
                          placeholder="اكتب السبب الثاني لاختيار هذه المنطقة كأولوية..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. اقترح إجراءين مناسبين لمعالجة المشكلة البيئية في هذه المنطقة */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                        ٣
                      </span>
                      <span>اقترح إجراءين مناسبين لمعالجة المشكلة البيئية في هذه المنطقة: <span className="text-rose-500">*</span></span>
                    </label>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ١
                        </span>
                        <input
                          type="text"
                          value={m4Act2Action1}
                          onChange={(e) => setM4Act2Action1(e.target.value)}
                          placeholder="اكتب المقترح الأول لمعالجة المشكلة البيئية..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 border border-slate-200">
                          ٢
                        </span>
                        <input
                          type="text"
                          value={m4Act2Action2}
                          onChange={(e) => setM4Act2Action2(e.target.value)}
                          placeholder="اكتب المقترح الثاني لمعالجة المشكلة البيئية..."
                          disabled={isSubmitting}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white transition-all outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* الموديول 4 - النشاط 3: كيف نجعل الحي أكثر استدامة؟ */}
              {isM4Act3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>اختر ثلاثة إجراءات من الخيارات المقترحة لتحسين استدامة الحي، وحدد المكان الأنسب لتنفيذ كل إجراء، ثم فسر اختيارك:</span>
                  </div>

                  {/* كروت الخيارات المقترحة للاسترشاد */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <span className="text-xs font-black text-asu-navy block">
                      خيارات مقترحة ومعالم من المخطط (للاسترشاد):
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {['تركيب حاويات فرز المخلفات', 'استخدام الطاقة الشمسية', 'زراعة الأشجار وتوسيع المساحات الخضراء', 'ترشيد استخدام المياه'].map((item) => (
                        <span key={item} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold">
                          • {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs pt-1">
                      {['أرض فضاء', 'مدرسة', 'حديقة صغيرة', 'طريق رئيسي', 'مناطق سكنية', 'حاويات مخلفات'].map((item) => (
                        <span key={item} className="px-2.5 py-1 rounded-lg bg-asu-navy/5 border border-asu-navy/15 text-asu-navy font-bold">
                          📍 {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* جدول الإجراءات الثلاثة */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800">
                      <TableIcon className="w-4 h-4 text-asu-gold-dark" />
                      <span>جدول خطة تحسين استدامة الحي:</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                      <table className="w-full text-right text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-asu-navy text-white text-xs font-black">
                            <th className="p-3 w-12 text-center">م</th>
                            <th className="p-3 min-w-[180px]">الإجراء الذي اخترته</th>
                            <th className="p-3 min-w-[150px]">المكان الأنسب للتنفيذ</th>
                            <th className="p-3 min-w-[200px]">سبب الاختيار</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {m4Act3Rows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 text-center font-black text-slate-700 bg-slate-50/60 border-l border-slate-100">
                                {row.id}
                              </td>
                              <td className="p-2.5 border-l border-slate-100">
                                <input
                                  type="text"
                                  value={row.measure}
                                  onChange={(e) => handleM4Act3Change(row.id, 'measure', e.target.value)}
                                  placeholder="اكتب الإجراء المختار..."
                                  disabled={isSubmitting}
                                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                                />
                              </td>
                              <td className="p-2.5 border-l border-slate-100">
                                <input
                                  type="text"
                                  value={row.location}
                                  onChange={(e) => handleM4Act3Change(row.id, 'location', e.target.value)}
                                  placeholder="المكان الأنسب بالحي..."
                                  disabled={isSubmitting}
                                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                                />
                              </td>
                              <td className="p-2.5">
                                <input
                                  type="text"
                                  value={row.reason}
                                  onChange={(e) => handleM4Act3Change(row.id, 'reason', e.target.value)}
                                  placeholder="فسر سبب اختيار هذا المكان..."
                                  disabled={isSubmitting}
                                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-asu-gold focus:ring-1 focus:ring-asu-gold/30 text-xs sm:text-sm text-slate-900 bg-white outline-hidden"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* أزرار الحفظ والتنقل المباشرة والواضحة */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {activeActivityIndex > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setActiveActivityIndex((prev) => prev - 1)}
                      className="gap-2 text-xs sm:text-sm font-bold border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4 ml-1" />
                      <span>النشاط السابق</span>
                    </Button>
                  ) : onBackToSlides ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={onBackToSlides}
                      className="gap-2 text-xs sm:text-sm font-bold border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4 ml-1" />
                      <span>العودة للشرائح</span>
                    </Button>
                  ) : null}

                  {activeActivityIndex < resolvedActivities.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setActiveActivityIndex((prev) => prev + 1)}
                      className="gap-2 text-xs sm:text-sm font-bold border-asu-navy/30 bg-asu-navy/5 text-asu-navy hover:bg-asu-navy hover:text-white cursor-pointer transition-all"
                    >
                      <span>الانتقال إلى النشاط التالي</span>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {hasSubmitted && (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting}
                      className="text-xs font-bold"
                    >
                      إلغاء التعديل
                    </Button>
                  )}

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isSubmitting}
                    className="gap-2 shadow-lg shadow-asu-gold/25 font-black text-xs sm:text-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4 ml-1" />
                    <span>{isSubmitting ? 'جاري الحفظ والتسليم...' : 'حفظ وتسليم حل الأنشطة'}</span>
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            /* عرض الإجابة المسلمة */
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-500 block">
                  إجابتك المسجلة في الأنشطة التطبيقية:
                </span>
                <pre className="text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-slate-200/60 font-sans">
                  {existingSubmission?.answerText}
                </pre>

                {existingSubmission?.submittedAt && (
                  <span className="text-[11px] text-slate-400 block pt-1 font-mono">
                    تاريخ التسليم:{' '}
                    {new Date(existingSubmission.submittedAt).toLocaleDateString('ar-EG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/70">
                  {onBackToSlides && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onBackToSlides}
                      className="gap-1.5 text-xs text-slate-600 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>العودة للشرائح</span>
                    </Button>
                  )}

                  {onProceedToQuiz && (
                    <Button
                      type="button"
                      variant="gold"
                      size="md"
                      onClick={onProceedToQuiz}
                      className="gap-2 font-black text-xs sm:text-sm cursor-pointer shadow-md shadow-asu-gold/20"
                    >
                      <span>الانتقال للاختبار</span>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* نافذة تكبير ورقة النشاط بحجم الشاشة الكاملة                                   */}
      {/* ========================================================================= */}
      {fullscreenImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <span className="text-asu-gold-light">{currentActivity.title}</span>
              <span>•</span>
              <span>ورقة النشاط الرسمية</span>
            </div>
            <button
              type="button"
              onClick={() => setFullscreenImageUrl(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all"
              aria-label="إغلاق التكبير"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullscreenImageUrl}
              alt={currentActivity.title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          <div className="flex items-center justify-center pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setFullscreenImageUrl(null)}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
