-- ==============================================================================
-- SEED LIBRARY VIDEOS (UP TO DATE WITH ENVIRONMENTAL TOPICS)
-- ==============================================================================

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-01',
  'تعريف النظام البيئي والمحيط الحيوي',
  'شرح علمي مفصل لمفهوم النظام البيئي، ومكونات الغلاف الحيوي، والتفاعل التبادلي المستمر بين العوامل الحية وغير الحية.',
  'https://www.youtube.com/watch?v=cfWtaYQIOrI',
  'cfWtaYQIOrI',
  'مكونات البيئة والنظم البيئية',
  '10 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-02',
  'الأحياء المنتجة ومكونات النظام البيئي الأساسية',
  'استعراض دور الكائنات المنتجة والنباتات الخضراء في تثبيت الطاقة وصنع الغذاء ودعم بقاء السلاسل الحيوية على كوكب الأرض.',
  'https://www.youtube.com/watch?v=sLReKnigejE',
  'sLReKnigejE',
  'مكونات البيئة والنظم البيئية',
  '8 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-03',
  'الأحياء المستهلكة والمفككات في التوازن البيئي',
  'تحليل أدوار الحيوانات المستهلكة والكائنات الدقيقة والمحللات في إعادة تدوير العناصر الغذائية والمادة العضوية في الطبيعة.',
  'https://www.youtube.com/watch?v=najmFRxMiIY',
  'najmFRxMiIY',
  'مكونات البيئة والنظم البيئية',
  '9 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-04',
  'السلاسل والشبكات الغذائية وتدفق الطاقة في البيئة',
  'دراسة تفصيلية لمستويات التغذية وهرم الطاقة وانتقال المواد بين الكائنات الحية داخل الشبكات الغذائية المتشابكة.',
  'https://www.youtube.com/watch?v=U3guV6KmHBI',
  'U3guV6KmHBI',
  'مكونات البيئة والنظم البيئية',
  '11 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-05',
  'التوازن الحيوي والتوازن الفيزيائي في البيئة',
  'فهم آليات الاتزان الطبيعي بين عناصر البيئة الفيزيائية والحيوية، وشروط الحفاظ على استقرار الأنظمة البيئية.',
  'https://www.youtube.com/watch?v=HbFZx6vYAEQ',
  'HbFZx6vYAEQ',
  'مكونات البيئة والنظم البيئية',
  '10 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-06',
  'أسباب اختلال التوازن البيئي والمشكلات الناتجة عنه',
  'استعراض العوامل الطبيعية والبشرية التي تؤدي إلى تدهور الاتزان البيئي وتأثير ذلك على الكائنات الحية والموارد الطبيعية.',
  'https://www.youtube.com/watch?v=TOm1clgspIE',
  'TOm1clgspIE',
  'مكونات البيئة والنظم البيئية',
  '12 دقيقة',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-07',
  'دور الأنشطة البشرية في اختلال التوازن البيئي',
  'تسليط الضوء على الأثر السلبي للتدخلات الإنسانية غير الرشيدة مثل قطع الغابات والاستهلاك المفرط للموارد الطبيعية.',
  'https://www.youtube.com/watch?v=CGmDTWRN-i4',
  'CGmDTWRN-i4',
  'التلوث البيئي وإدارته',
  '11 دقيقة',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-08',
  'المشكلات الناتجة عن تلوث الهواء وانبعاثات الغازات',
  'دراسة مصادر انبعاثات الغازات السامة وعوادم المصانع، والآثار البيئية والمناخية والصحية المترتبة على تلوث الغلاف الجوي.',
  'https://www.youtube.com/watch?v=i8YLvoGB0B8',
  'i8YLvoGB0B8',
  'التلوث البيئي وإدارته',
  '13 دقيقة',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-09',
  'الضباب الدخاني والتلوث الجوي في المدن والمناطق الصناعية',
  'تحليل أسباب تشكل ظاهرة الضباب الدخاني والتركيزات المكانية للملوثات في المدن الكبرى وطرق التقليل منها.',
  'https://www.youtube.com/watch?v=D7FBD5XCSfI',
  'D7FBD5XCSfI',
  'التلوث البيئي وإدارته',
  '9 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-10',
  'تلوث المياه ومصادر التلوث المائي في المجاري والبحار',
  'كيف تتسرب المخلفات الصناعية ومياه الصرف إلى الأنهار والمياه الجوفية، وتهديد ذلك للثروة المائية وصحة المجتمعات.',
  'https://www.youtube.com/watch?v=hmhyR4gsWtI',
  'hmhyR4gsWtI',
  'التلوث البيئي وإدارته',
  '10 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-11',
  'تلوث التربة والمخلفات وتدهور الأراضي الزراعية',
  'أسباب تدهور خصوبة التربة الزراعية جراء الإفراط في المبيدات والمخلفات الصلبة، وتأثير ذلك على الأمن الغذائي والاستدامة.',
  'https://www.youtube.com/watch?v=LcRQD-ftYig',
  'LcRQD-ftYig',
  'التلوث البيئي وإدارته',
  '10 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-12',
  'التلوث الضوضائي في البيئات الحضرية وتأثيراته',
  'الآثار السلبية للضجيج وأصوات المركبات والآلات الصناعية على صحة الإنسان وسلوكه، مع استعراض حلول التخطيط المكاني.',
  'https://www.youtube.com/watch?v=2GuYlSRcuDQ',
  '2GuYlSRcuDQ',
  'التلوث البيئي وإدارته',
  '8 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-13',
  'التلوث الحراري للمسطحات المائية ومحطات الطاقة',
  'تأثير مياه التبريد الصادرة عن المحطات الصناعية في رفع حرارة المياه الطبيعية وأثر ذلك المباشر على التنوع الحيوي المائي.',
  'https://www.youtube.com/watch?v=5Bk5N2zFkN8',
  '5Bk5N2zFkN8',
  'التلوث البيئي وإدارته',
  '9 دقائق',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-14',
  'التلوث الإشعاعي والمخاطر البيئية الناتجة عن النفايات',
  'التعريف بالإشعاعات البيئية وطرق إدارة النفايات الخطرة، والاحتياطات المكانية والأمنية لحماية النظم البيئية والإنسان.',
  'https://www.youtube.com/watch?v=Kn74iDpTKH4',
  'Kn74iDpTKH4',
  'التلوث البيئي وإدارته',
  '11 دقيقة',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-15',
  'كيف نعيد التوازن البيئي (الجزء الأول): الحماية والتشجير',
  'استراتيجيات عملية للأفراد والمجتمعات للمساهمة في استعادة التوازن البيئي، التوسع في الأحزمة الخضراء، ومكافحة التصحر.',
  'https://www.youtube.com/watch?v=4eiyOPHDF-M',
  '4eiyOPHDF-M',
  'الاستدامة البيئية وإدارة الموارد',
  '12 دقيقة',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-env-16',
  'كيف نعيد التوازن البيئي (الجزء الثاني): ترشيد الموارد والتدوير',
  'آليات إدارة النفايات، ترشيد استهلاك الطاقة والمياه، وتطبيق ممارسات الاستدامة اليومية لضمان مستقبل نظيف للأجيال القادمة.',
  'https://www.youtube.com/watch?v=-CC1Rl-vCfg',
  '-CC1Rl-vCfg',
  'الاستدامة البيئية وإدارة الموارد',
  '14 دقيقة',
  '2026-10-03'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

