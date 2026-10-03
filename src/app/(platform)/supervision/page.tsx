export const metadata = {
  title: 'الإعداد والإشراف | منصة الوعي بقضايا البيئة للمرحلة الثانوية • جامعة عين شمس',
  description: 'فريق الإعداد والإشراف العلمي - كلية التربية جامعة عين شمس',
};

// رابط الصورة المعتمدة للإعداد والإشراف من Cloudinary
const SUPERVISION_IMAGE_SRC =
  'https://res.cloudinary.com/makcnu5x/image/upload/v1790595778/1790595743141-01a0e7d2-02c9-7016-b5ad-fdbd0addfde5.png';

export default function SupervisionPage() {
  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-2 sm:px-4">
      {/* ========================================================================= */}
      {/* 👑 الإطار الأكاديمي الفاخر والأنيق                                         */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl p-3 sm:p-5 md:p-6 bg-gradient-to-br from-asu-navy-dark via-asu-navy to-[#0f183e] shadow-[0_25px_65px_rgba(16,26,68,0.55)] border-2 border-asu-gold/80">

        {/* هالات الإضاءة التراثية الذهبية خلف الإطار */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-asu-gold/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-asu-gold/20 rounded-full blur-3xl pointer-events-none" />

        {/* خط الإطار الذهبي الداخلي المزدوج (Double Inset Gold Filigree) */}
        <div className="relative rounded-2xl p-2 sm:p-3 border border-asu-gold/50 bg-gradient-to-b from-white/5 to-black/30 backdrop-blur-xs">
          
          {/* زخارف أركان الإطار الملكية الأربعة (Royal Corner Ornaments) */}
          <div className="absolute top-2 right-2 w-7 h-7 sm:w-9 sm:h-9 border-t-2 border-r-2 border-asu-gold rounded-tr-xl pointer-events-none" />
          <div className="absolute top-2 left-2 w-7 h-7 sm:w-9 sm:h-9 border-t-2 border-l-2 border-asu-gold rounded-tl-xl pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-7 h-7 sm:w-9 sm:h-9 border-b-2 border-r-2 border-asu-gold rounded-br-xl pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-7 h-7 sm:w-9 sm:h-9 border-b-2 border-l-2 border-asu-gold rounded-bl-xl pointer-events-none" />

          {/* حاوية الصورة الملكية المجهزة بدقة فائقة - الصورة فقط بدون أي نصوص */}
          <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl flex items-center justify-center border-2 border-asu-gold/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SUPERVISION_IMAGE_SRC}
              alt="الإعداد والإشراف - جامعة عين شمس • كلية التربية"
              className="w-full h-auto max-h-[88vh] object-contain rounded-xl transition-transform duration-500 hover:scale-[1.006]"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
