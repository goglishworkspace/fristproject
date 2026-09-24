import React from 'react';

interface RoyalEagleProps {
  className?: string;
}

export function RoyalEagle({ className = '' }: RoyalEagleProps) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* هالة ذهبية هادئة وناعمة في الخلفية */}
      <div className="absolute inset-0 bg-asu-gold/20 blur-xl rounded-full" />

      <svg
        viewBox="0 0 280 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] filter"
      >
        <defs>
          {/* تدرج الذهب الصافي اللامع */}
          <linearGradient id="eagleGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="30%" stopColor="#FBD668" />
            <stop offset="70%" stopColor="#C89324" />
            <stop offset="100%" stopColor="#8A5A0A" />
          </linearGradient>

          {/* تدرج الظلال الذهبية العميقة */}
          <linearGradient id="eagleGoldDeep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DCA732" />
            <stop offset="60%" stopColor="#96610E" />
            <stop offset="100%" stopColor="#543303" />
          </linearGradient>

          {/* لمعان خطي للريش والمنقار */}
          <linearGradient id="eagleBeak" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFECA8" />
            <stop offset="60%" stopColor="#E29215" />
            <stop offset="100%" stopColor="#7A4505" />
          </linearGradient>

          {/* تدرج الجناح الأيمن الانسيابي */}
          <linearGradient id="sleekWingRight" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#C89324" />
            <stop offset="100%" stopColor="#6B4104" />
          </linearGradient>

          {/* تدرج الجناح الأيسر الانسيابي */}
          <linearGradient id="sleekWingLeft" x1="100%" y1="0%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#C89324" />
            <stop offset="100%" stopColor="#6B4104" />
          </linearGradient>
        </defs>

        {/* 1. الجناح الأيمن الانسيابي الأنيق (Sleek Right Wing) */}
        <g id="right-wing">
          {/* الريشة العليا الكبرى */}
          <path
            d="M140 45 C165 30 205 20 268 10 C250 26 230 40 205 48 C175 56 155 52 140 50 Z"
            fill="url(#sleekWingRight)"
          />
          {/* الريشة الوسطى */}
          <path
            d="M140 50 C168 42 205 38 258 24 C240 40 218 54 185 62 C160 66 148 60 140 56 Z"
            fill="url(#eagleGoldDeep)"
          />
          {/* الريشة السفلى الناعمة */}
          <path
            d="M140 56 C165 52 195 52 235 42 C215 56 190 68 165 70 C150 71 144 65 140 62 Z"
            fill="url(#eagleGoldLight)"
          />
        </g>

        {/* 2. الجناح الأيسر الانسيابي الأنيق (Sleek Left Wing) */}
        <g id="left-wing">
          {/* الريشة العليا الكبرى */}
          <path
            d="M140 45 C115 30 75 20 12 10 C30 26 50 40 75 48 C105 56 125 52 140 50 Z"
            fill="url(#sleekWingLeft)"
          />
          {/* الريشة الوسطى */}
          <path
            d="M140 50 C112 42 75 38 22 24 C40 40 62 54 95 62 C120 66 132 60 140 56 Z"
            fill="url(#eagleGoldDeep)"
          />
          {/* الريشة السفلى الناعمة */}
          <path
            d="M140 56 C115 52 85 52 45 42 C65 56 90 68 115 70 C130 71 136 65 140 62 Z"
            fill="url(#eagleGoldLight)"
          />
        </g>

        {/* 3. قاعدة النسر الملكية المصقولة (Minimal Golden Plinth) */}
        <path
          d="M110 72 C125 68 155 68 170 72 C165 77 115 77 110 72 Z"
          fill="url(#eagleGoldDeep)"
        />
        <path
          d="M116 73 C128 70 152 70 164 73 C160 76 120 76 116 73 Z"
          fill="url(#eagleGoldLight)"
        />

        {/* 4. ريش الصدر والرقبة المصقول (Refined Chest) */}
        <path
          d="M128 48 C132 58 136 68 140 72 C144 68 148 58 152 48 Z"
          fill="url(#eagleGoldDeep)"
        />
        <path
          d="M132 50 C135 58 138 64 140 68 C142 64 145 58 148 50 Z"
          fill="url(#eagleGoldLight)"
        />

        {/* 5. رأس النسر الواضح الشامخ (Refined Regal Eagle Head) */}
        {/* قمة الرأس والتاج */}
        <path
          d="M130 38 C130 22 136 12 140 6 C144 12 150 22 150 38 C146 35 144 35 140 35 C136 35 134 35 130 38 Z"
          fill="url(#eagleGoldLight)"
        />
        {/* لمعة تاج الرأس */}
        <path
          d="M137 14 C139 10 140 8 140 8 C140 8 141 10 143 14 C141 12 139 12 137 14 Z"
          fill="#FFFFFF"
        />

        {/* جانبا الرأس وتجويف العينين */}
        <path
          d="M130 36 C129 44 133 49 137 51 C139 46 138 40 135 37 Z"
          fill="url(#eagleGoldDeep)"
        />
        <path
          d="M150 36 C151 44 147 49 143 51 C141 46 142 40 145 37 Z"
          fill="url(#eagleGoldDeep)"
        />

        {/* قوس الحاجب القوي الحاد */}
        <path
          d="M131 32 C135 30 138 33 140 35 C142 33 145 30 149 32 C146 34 143 35 140 37 C137 35 134 34 131 32 Z"
          fill="url(#eagleGoldLight)"
          stroke="#543303"
          strokeWidth="0.6"
        />

        {/* العينان الثاقبتان البسيطتان */}
        {/* عين يسار */}
        <ellipse cx="134.5" cy="34.5" rx="2" ry="1.4" fill="#000000" />
        <circle cx="134" cy="34" r="0.6" fill="#FFF9E6" />

        {/* عين يمين */}
        <ellipse cx="145.5" cy="34.5" rx="2" ry="1.4" fill="#000000" />
        <circle cx="146" cy="34" r="0.6" fill="#FFF9E6" />

        {/* المنقار المعقوف الصريح والواضح (Signature Regal Beak) */}
        <path
          d="M137 37 C138 36 142 36 143 37 C145 42 144 50 140 55 C136 50 135 42 137 37 Z"
          fill="url(#eagleBeak)"
          stroke="#543303"
          strokeWidth="0.6"
        />
        {/* انعكاس الضوء على سن المنقار */}
        <path
          d="M139 38 C140 37 140 37 141 38 C142 42 142 48 140 52 C139 48 139 42 139 38 Z"
          fill="#FFFDF0"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
