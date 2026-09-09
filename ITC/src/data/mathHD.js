// HD text overrides for math image questions, keyed by image id.
// When a question's id is here, the app renders crisp KaTeX/Tajawal text.
// 56 of 60 math questions are transcribed here (answer-verified).
// The 4 NOT here (ITC-MATH-0057..0060) contain geometric FIGURES whose
// dimensions live in the diagram, so they keep their enhanced image.
//
// Segment types: {type:"ar"} plain Arabic, {type:"tex"} inline math,
// {type:"block"} large centered equation (triggers stacked layout).
// Options: {tex:"..."} math, {ar:"..."} text; optional {label:"E"} for
// questions that use non-ABCD labels (e.g. ITC-MATH-0051 uses E/F/G/H).

export const mathHD = {
  "ITC-MATH-0001": {
    "prompt": [
      {
        "type": "ar",
        "text": "اختر الصيغة القياسية الصحيحة للرقم التالي «خمسمئة واثنا عشر ألفًا وثلاثمئة وسبعة وأربعين»."
      }
    ],
    "options": [
      {
        "ar": "512347"
      },
      {
        "ar": "347512"
      },
      {
        "ar": "512437"
      },
      {
        "ar": "521347"
      }
    ]
  },
  "ITC-MATH-0009": {
    "prompt": [
      {
        "type": "ar",
        "text": "الكسر الاعتيادي المكافئ للنسبة "
      },
      {
        "type": "tex",
        "text": "125\\%"
      },
      {
        "type": "ar",
        "text": " في أبسط صورة:"
      }
    ],
    "options": [
      {
        "tex": "\\frac{1}{4}"
      },
      {
        "tex": "\\frac{5}{4}"
      },
      {
        "tex": "\\frac{125}{10}"
      },
      {
        "tex": "1.25"
      }
    ]
  },
  "ITC-MATH-0013": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد ناتج الضرب:"
      },
      {
        "type": "block",
        "text": "(4.1\\times 10^{5})\\times(2\\times 10^{4})"
      }
    ],
    "options": [
      {
        "tex": "6.1\\times 10^{9}"
      },
      {
        "tex": "8.2\\times 10^{20}"
      },
      {
        "tex": "8.2\\times 10^{9}"
      },
      {
        "tex": "8.2\\times 10^{1}"
      }
    ]
  },
  "ITC-MATH-0021": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "اضرب وبسّط التعبير الرياضي التالي:"
      },
      {
        "type": "block",
        "text": "(a+3)(2a-5)"
      }
    ],
    "options": [
      {
        "tex": "2a^{2}+a-15"
      },
      {
        "tex": "2a^{2}-a+15"
      },
      {
        "tex": "2a^{2}+6a-15"
      },
      {
        "tex": "a^{2}+a-15"
      }
    ]
  },
  "ITC-MATH-0026": {
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد معادلة الخط المستقيم الذي يكون ميله "
      },
      {
        "type": "tex",
        "text": "m=\\frac{3}{2}"
      },
      {
        "type": "ar",
        "text": " ومقطعه الصادي "
      },
      {
        "type": "tex",
        "text": "b=-1"
      },
      {
        "type": "ar",
        "text": "."
      }
    ],
    "options": [
      {
        "tex": "y=\\frac{2}{3}x-1"
      },
      {
        "tex": "y=\\frac{3}{2}x-1"
      },
      {
        "tex": "y=\\frac{3}{2}x+1"
      },
      {
        "tex": "y=-x+\\frac{3}{2}"
      }
    ]
  },
  "ITC-MATH-0033": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما هو مجموع الحدود الخمسة الأولى في المتتالية الحسابية:"
      },
      {
        "type": "block",
        "text": "3,\\ 7,\\ \\ldots,\\ \\ldots,\\ 19"
      }
    ],
    "options": [
      {
        "ar": "45"
      },
      {
        "ar": "50"
      },
      {
        "ar": "55"
      },
      {
        "ar": "60"
      }
    ]
  },
  "ITC-MATH-0041": {
    "prompt": [
      {
        "type": "ar",
        "text": "ما قيمة "
      },
      {
        "type": "tex",
        "text": "i^{34}"
      },
      {
        "type": "ar",
        "text": "؟"
      }
    ],
    "options": [
      {
        "tex": "i"
      },
      {
        "tex": "-1"
      },
      {
        "tex": "1"
      },
      {
        "tex": "-i"
      }
    ]
  },
  "ITC-MATH-0045": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد المصفوفة "
      },
      {
        "type": "tex",
        "text": "X"
      },
      {
        "type": "ar",
        "text": " إذا كان:"
      },
      {
        "type": "block",
        "text": "2X+\\begin{bmatrix}1&-3\\\\4&0\\end{bmatrix}=\\begin{bmatrix}7&5\\\\2&8\\end{bmatrix}"
      }
    ],
    "options": [
      {
        "tex": "\\begin{bmatrix}3&4\\\\-1&4\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}4&3\\\\4&-1\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}6&8\\\\-2&8\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}2&1\\\\5&4\\end{bmatrix}"
      }
    ]
  },
  "ITC-MATH-0049": {
    "prompt": [
      {
        "type": "ar",
        "text": "إذا كان "
      },
      {
        "type": "tex",
        "text": "\\cos\\theta=\\frac{8}{17}"
      },
      {
        "type": "ar",
        "text": " حيث إنّ "
      },
      {
        "type": "tex",
        "text": "\\theta"
      },
      {
        "type": "ar",
        "text": " تقع في الربع الرابع، فأوجد قيمة "
      },
      {
        "type": "tex",
        "text": "\\sin\\theta"
      },
      {
        "type": "ar",
        "text": "."
      }
    ],
    "options": [
      {
        "tex": "\\frac{15}{17}"
      },
      {
        "tex": "\\frac{8}{15}"
      },
      {
        "tex": "-\\frac{15}{17}"
      },
      {
        "tex": "-\\frac{8}{15}"
      }
    ]
  },
  "ITC-MATH-0002": {
    "prompt": [
      {
        "type": "ar",
        "text": "يُكتب العدد 2407615 لفظيًا على الصورة التالية:"
      }
    ],
    "options": [
      {
        "ar": "مليونان وأربعمئة وسبعة آلاف وستمئة وخمسة عشر."
      },
      {
        "ar": "مليونان وسبعة وأربعون ألفًا وستمئة وخمسة عشر."
      },
      {
        "ar": "مليونان وأربعمئة وسبعون ألفًا وستمئة وخمسة عشر."
      },
      {
        "ar": "مليونان وأربعمئة وسبعة آلاف وخمسة وستون."
      }
    ]
  },
  "ITC-MATH-0003": {
    "prompt": [
      {
        "type": "ar",
        "text": "ما هو القاسم المشترك الأكبر للعددين 96، 72؟"
      }
    ],
    "options": [
      {
        "ar": "12"
      },
      {
        "ar": "24"
      },
      {
        "ar": "36"
      },
      {
        "ar": "48"
      }
    ]
  },
  "ITC-MATH-0004": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد قيمة:"
      },
      {
        "type": "block",
        "text": "4!-18"
      }
    ],
    "options": [
      {
        "ar": "6"
      },
      {
        "ar": "-6"
      },
      {
        "ar": "14"
      },
      {
        "ar": "-14"
      }
    ]
  },
  "ITC-MATH-0005": {
    "prompt": [
      {
        "type": "ar",
        "text": "حوّل العدد الكسري المختلط "
      },
      {
        "type": "tex",
        "text": "4\\tfrac{2}{5}"
      },
      {
        "type": "ar",
        "text": " إلى كسر اعتيادي."
      }
    ],
    "options": [
      {
        "tex": "\\frac{20}{5}"
      },
      {
        "tex": "\\frac{22}{5}"
      },
      {
        "tex": "\\frac{18}{5}"
      },
      {
        "tex": "\\frac{9}{5}"
      }
    ]
  },
  "ITC-MATH-0006": {
    "prompt": [
      {
        "type": "ar",
        "text": "اكتب العدد التالي "
      },
      {
        "type": "tex",
        "text": "\\frac{9}{4}"
      },
      {
        "type": "ar",
        "text": " على الصورة العشرية:"
      }
    ],
    "options": [
      {
        "ar": "2.4"
      },
      {
        "ar": "2.25"
      },
      {
        "ar": "0.44"
      },
      {
        "ar": "4.9"
      }
    ]
  },
  "ITC-MATH-0007": {
    "prompt": [
      {
        "type": "ar",
        "text": "أكتب الكسر التالي "
      },
      {
        "type": "tex",
        "text": "\\frac{7}{20}"
      },
      {
        "type": "ar",
        "text": " على صورة نسبة مئوية:"
      }
    ],
    "options": [
      {
        "ar": "0.35%"
      },
      {
        "ar": "3.5%"
      },
      {
        "ar": "35%"
      },
      {
        "ar": "350%"
      }
    ]
  },
  "ITC-MATH-0008": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد ناتج قسمة الأعداد العشرية التالية:"
      },
      {
        "type": "block",
        "text": "8.64 \\div 1.2"
      }
    ],
    "options": [
      {
        "ar": "7.2"
      },
      {
        "ar": "0.72"
      },
      {
        "ar": "72"
      },
      {
        "ar": "6.2"
      }
    ]
  },
  "ITC-MATH-0010": {
    "prompt": [
      {
        "type": "ar",
        "text": "18 تمثل 30% من العدد:"
      }
    ],
    "options": [
      {
        "ar": "54"
      },
      {
        "ar": "60"
      },
      {
        "ar": "72"
      },
      {
        "ar": "90"
      }
    ]
  },
  "ITC-MATH-0011": {
    "prompt": [
      {
        "type": "ar",
        "text": "تم فرض ضريبة إضافية على سلعة ما مقدارها 15%، إذا كانت قيمة السلعة الحالية 260 ريال، ما هي قيمة السلعة بعد تطبيق ضريبة القيمة المضافة؟"
      }
    ],
    "options": [
      {
        "ar": "39 ريال"
      },
      {
        "ar": "221 ريال"
      },
      {
        "ar": "299 ريال"
      },
      {
        "ar": "275 ريال"
      }
    ]
  },
  "ITC-MATH-0012": {
    "prompt": [
      {
        "type": "ar",
        "text": "قيمة "
      },
      {
        "type": "tex",
        "text": "x"
      },
      {
        "type": "ar",
        "text": " تتغير طرديًا مع "
      },
      {
        "type": "tex",
        "text": "y"
      },
      {
        "type": "ar",
        "text": " بحيث أن "
      },
      {
        "type": "tex",
        "text": "5x-20y=0"
      },
      {
        "type": "ar",
        "text": "، أوجد قيمة ثابت التناسب "
      },
      {
        "type": "tex",
        "text": "k"
      },
      {
        "type": "ar",
        "text": "؟"
      }
    ],
    "options": [
      {
        "ar": "5"
      },
      {
        "ar": "4"
      },
      {
        "ar": "20"
      },
      {
        "ar": "25"
      }
    ]
  },
  "ITC-MATH-0014": {
    "prompt": [
      {
        "type": "ar",
        "text": "اكتب الرقم 0.00672 بالصيغة العلمية."
      }
    ],
    "options": [
      {
        "tex": "6.72\\times 10^{-3}"
      },
      {
        "tex": "67.2\\times 10^{-4}"
      },
      {
        "tex": "6.72\\times 10^{3}"
      },
      {
        "tex": "0.672\\times 10^{-2}"
      }
    ]
  },
  "ITC-MATH-0015": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "بسّط التعبير الرياضي:"
      },
      {
        "type": "block",
        "text": "\\frac{18x^{4}y^{5}}{3xy^{2}}"
      }
    ],
    "options": [
      {
        "tex": "6x^{4}y^{3}"
      },
      {
        "tex": "6x^{3}y^{3}"
      },
      {
        "tex": "15x^{3}y^{7}"
      },
      {
        "tex": "6x^{3}y^{2}"
      }
    ]
  },
  "ITC-MATH-0016": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما هي قيمة:"
      },
      {
        "type": "block",
        "text": "2.4\\times 10^{2}\\times 3.5\\times 10^{3}"
      }
    ],
    "options": [
      {
        "tex": "8.4\\times 10^{6}"
      },
      {
        "tex": "5.9\\times 10^{5}"
      },
      {
        "tex": "8.4\\times 10^{5}"
      },
      {
        "tex": "8.4\\times 10^{1}"
      }
    ]
  },
  "ITC-MATH-0017": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد حل المعادلة الخطية التالية:"
      },
      {
        "type": "block",
        "text": "2x-5=11"
      }
    ],
    "options": [
      {
        "ar": "8"
      },
      {
        "ar": "3"
      },
      {
        "ar": "-8"
      },
      {
        "ar": "16"
      }
    ]
  },
  "ITC-MATH-0018": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد ناتج المتباينة التالية:"
      },
      {
        "type": "block",
        "text": "-4\\le 2x+6<12"
      }
    ],
    "options": [
      {
        "text": "-5 ≤ x < 3"
      },
      {
        "text": "-5 < x ≤ 3"
      },
      {
        "text": "-2 ≤ x < 9"
      },
      {
        "text": "-10 ≤ x < 6"
      }
    ]
  },
  "ITC-MATH-0019": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد حل المعادلة التربيعية التالية:"
      },
      {
        "type": "block",
        "text": "(x+2)^{2}=36"
      }
    ],
    "options": [
      {
        "text": "x = 6 or x = -6"
      },
      {
        "text": "x = 4 or x = -8"
      },
      {
        "text": "x = 2 or x = -10"
      },
      {
        "text": "x = ±4"
      }
    ]
  },
  "ITC-MATH-0020": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما هو حل نظام المعادلات التالي:"
      },
      {
        "type": "block",
        "text": "\\begin{cases}x+y=7\\\\2x-y=5\\end{cases}"
      }
    ],
    "options": [
      {
        "text": "x = 4, y = 3"
      },
      {
        "text": "x = 3, y = 4"
      },
      {
        "text": "x = -4, y = 11"
      },
      {
        "text": "x = 5, y = 2"
      }
    ]
  },
  "ITC-MATH-0022": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "بسّط:"
      },
      {
        "type": "block",
        "text": "\\frac{12x^{5}+18x^{3}-6x^{2}}{6x^{2}}"
      }
    ],
    "options": [
      {
        "tex": "2x^{3}+3x-1"
      },
      {
        "tex": "2x^{3}+3x+1"
      },
      {
        "tex": "2x^{7}+3x^{5}-x^{4}"
      },
      {
        "tex": "6x^{3}+12x"
      }
    ]
  },
  "ITC-MATH-0023": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما ناتج قسمة التعبير الرياضي التالي:"
      },
      {
        "type": "block",
        "text": "(x^{2}+5x+6)\\div(x+2)"
      }
    ],
    "options": [
      {
        "text": "x + 2"
      },
      {
        "text": "x + 3"
      },
      {
        "text": "x - 3"
      },
      {
        "text": "x² + 3"
      }
    ]
  },
  "ITC-MATH-0024": {
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد الحد الثالث في المفكوك: "
      },
      {
        "type": "tex",
        "text": "(x+3)^{4}"
      }
    ],
    "options": [
      {
        "tex": "108x"
      },
      {
        "tex": "54x^{2}"
      },
      {
        "tex": "36x^{2}"
      },
      {
        "tex": "27x^{3}"
      }
    ]
  },
  "ITC-MATH-0025": {
    "prompt": [
      {
        "type": "ar",
        "text": "ما هي إحداثيات منتصف القطعة المستقيمة الواصلة بين النقطتين "
      },
      {
        "type": "tex",
        "text": "A(-2,5)"
      },
      {
        "type": "ar",
        "text": " و "
      },
      {
        "type": "tex",
        "text": "B(6,-1)"
      }
    ],
    "options": [
      {
        "text": "(4, 4)"
      },
      {
        "text": "(2, 2)"
      },
      {
        "text": "(-4, 6)"
      },
      {
        "text": "(8, -6)"
      }
    ]
  },
  "ITC-MATH-0027": {
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد إحداثيات المركز ونصف القطر للدائرة ذات المعادلة التالية: "
      },
      {
        "type": "tex",
        "text": "(x+4)^{2}+(y-2)^{2}=49"
      }
    ],
    "options": [
      {
        "text": "(4, 2), r = 49"
      },
      {
        "text": "(-4, 2), r = 49"
      },
      {
        "text": "(-4, 2), r = 7"
      },
      {
        "text": "(4, 2), r = 7"
      }
    ]
  },
  "ITC-MATH-0028": {
    "prompt": [
      {
        "type": "ar",
        "text": "اكتب معادلة الدائرة التي تمر بالنقطة "
      },
      {
        "type": "tex",
        "text": "(-1,-2)"
      },
      {
        "type": "ar",
        "text": " وطول قطرها 6."
      }
    ],
    "options": [
      {
        "tex": "(x+1)^{2}+(y+2)^{2}=36"
      },
      {
        "tex": "(x-1)^{2}+(y-2)^{2}=36"
      },
      {
        "tex": "(x+1)^{2}+(y+2)^{2}=9"
      },
      {
        "tex": "(x-1)^{2}+(y-2)^{2}=9"
      }
    ]
  },
  "ITC-MATH-0029": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما هو حل المعادلة اللوغاريتمية:"
      },
      {
        "type": "block",
        "text": "\\log_{5}(2x-1)=2"
      }
    ],
    "options": [
      {
        "ar": "12"
      },
      {
        "ar": "13"
      },
      {
        "ar": "25"
      },
      {
        "ar": "5"
      }
    ]
  },
  "ITC-MATH-0030": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما هو حل المعادلة اللوغاريتمية:"
      },
      {
        "type": "block",
        "text": "\\log_{3}(x+4)-\\log_{3}(2)=\\log_{3}(5)"
      }
    ],
    "options": [
      {
        "ar": "6"
      },
      {
        "ar": "10"
      },
      {
        "ar": "14"
      },
      {
        "ar": "1"
      }
    ]
  },
  "ITC-MATH-0031": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما هو حل المعادلة الأسية:"
      },
      {
        "type": "block",
        "text": "2^{(2x-5)}=32"
      }
    ],
    "options": [
      {
        "ar": "0"
      },
      {
        "ar": "-5"
      },
      {
        "ar": "5"
      },
      {
        "ar": "10"
      }
    ]
  },
  "ITC-MATH-0032": {
    "prompt": [
      {
        "type": "ar",
        "text": "ما قيمة "
      },
      {
        "type": "tex",
        "text": "\\log_{10}1000"
      },
      {
        "type": "ar",
        "text": "؟"
      }
    ],
    "options": [
      {
        "ar": "3"
      },
      {
        "ar": "-3"
      },
      {
        "ar": "10"
      },
      {
        "ar": "2"
      }
    ]
  },
  "ITC-MATH-0034": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما مجموع المتسلسلة الحسابية التالية:"
      },
      {
        "type": "block",
        "text": "\\sum_{n=1}^{10}(2n+1)"
      }
    ],
    "options": [
      {
        "ar": "110"
      },
      {
        "ar": "120"
      },
      {
        "ar": "100"
      },
      {
        "ar": "60"
      }
    ]
  },
  "ITC-MATH-0035": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما قيمة الحد التاسع في المتسلسلة:"
      },
      {
        "type": "block",
        "text": "2,\\ 4,\\ 8,\\ 16,\\ 32,\\ \\ldots"
      }
    ],
    "options": [
      {
        "ar": "18"
      },
      {
        "ar": "512"
      },
      {
        "ar": "256"
      },
      {
        "ar": "1024"
      }
    ]
  },
  "ITC-MATH-0036": {
    "prompt": [
      {
        "type": "ar",
        "text": "أي مما يلي تمثل متتالية حسابية؟"
      }
    ],
    "options": [
      {
        "text": "3, 5, 7, 9, ..."
      },
      {
        "text": "-6, -9, -10, -14, ..."
      },
      {
        "text": "64, 32, 16, 8, ..."
      },
      {
        "text": "3, 5, 8, 11, ..."
      }
    ]
  },
  "ITC-MATH-0037": {
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد قيمة "
      },
      {
        "type": "tex",
        "text": "{}^{9}C_{2}"
      },
      {
        "type": "ar",
        "text": ":"
      }
    ],
    "options": [
      {
        "ar": "72"
      },
      {
        "ar": "36"
      },
      {
        "ar": "18"
      },
      {
        "ar": "84"
      }
    ]
  },
  "ITC-MATH-0038": {
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد قيمة "
      },
      {
        "type": "tex",
        "text": "{}^{6}P_{3}"
      },
      {
        "type": "ar",
        "text": ":"
      }
    ],
    "options": [
      {
        "ar": "18"
      },
      {
        "ar": "60"
      },
      {
        "ar": "120"
      },
      {
        "ar": "216"
      }
    ]
  },
  "ITC-MATH-0039": {
    "prompt": [
      {
        "type": "ar",
        "text": "عند رمي قطعة النرد عشوائيًا مرتين، ما احتمال ظهور الوجه ذو الرقم 4 في المرتين؟"
      }
    ],
    "options": [
      {
        "tex": "\\frac{1}{12}"
      },
      {
        "tex": "\\frac{1}{36}"
      },
      {
        "tex": "\\frac{1}{6}"
      },
      {
        "tex": "\\frac{1}{18}"
      }
    ]
  },
  "ITC-MATH-0040": {
    "prompt": [
      {
        "type": "ar",
        "text": "لديك صندوق يحتوي على 4 مكعبات، و2 كرات، و6 مناشير، تم سحب شكل واحد منهم عشوائيًا، ما احتمال أن يكون الشكل المسحوب كرة؟"
      }
    ],
    "options": [
      {
        "tex": "\\frac{1}{6}"
      },
      {
        "tex": "\\frac{1}{3}"
      },
      {
        "tex": "\\frac{2}{10}"
      },
      {
        "tex": "\\frac{6}{12}"
      }
    ]
  },
  "ITC-MATH-0042": {
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد قيمة "
      },
      {
        "type": "tex",
        "text": "(5-2i)\\times(5+2i)"
      },
      {
        "type": "ar",
        "text": "."
      }
    ],
    "options": [
      {
        "ar": "21"
      },
      {
        "ar": "25"
      },
      {
        "ar": "29"
      },
      {
        "ar": "9"
      }
    ]
  },
  "ITC-MATH-0043": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد ناتج "
      },
      {
        "type": "block",
        "text": "\\frac{2i}{2-i}"
      }
    ],
    "options": [
      {
        "tex": "\\frac{4i}{4-i}"
      },
      {
        "tex": "\\frac{2i+2}{4}"
      },
      {
        "tex": "\\frac{2i}{2-i}"
      },
      {
        "tex": "\\frac{-2+4i}{5}"
      }
    ]
  },
  "ITC-MATH-0044": {
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد قيمة "
      },
      {
        "type": "tex",
        "text": "2i(3-2i)"
      },
      {
        "type": "ar",
        "text": "."
      }
    ],
    "options": [
      {
        "text": "4i"
      },
      {
        "text": "10i"
      },
      {
        "text": "-4 + 6i"
      },
      {
        "text": "4 + 6i"
      }
    ]
  },
  "ITC-MATH-0046": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "ما هو ناتج المحددة التالية؟"
      },
      {
        "type": "block",
        "text": "\\begin{vmatrix}2&4\\\\1&3\\end{vmatrix}"
      }
    ],
    "options": [
      {
        "ar": "2"
      },
      {
        "ar": "10"
      },
      {
        "ar": "4"
      },
      {
        "ar": "8"
      }
    ]
  },
  "ITC-MATH-0047": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد ناتج جمع المصفوفتين:"
      },
      {
        "type": "block",
        "text": "\\begin{bmatrix}3&4\\\\8&-2\\end{bmatrix}+\\begin{bmatrix}1&0\\\\1&2\\end{bmatrix}"
      }
    ],
    "options": [
      {
        "tex": "\\begin{bmatrix}3&0\\\\8&2\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}4&1\\\\-2&1\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}-6&32\\\\8&2\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}4&4\\\\9&0\\end{bmatrix}"
      }
    ]
  },
  "ITC-MATH-0048": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "هو معكوس المصفوفة:"
      },
      {
        "type": "block",
        "text": "\\begin{bmatrix}10&3\\\\3&1\\end{bmatrix}"
      }
    ],
    "options": [
      {
        "tex": "\\begin{bmatrix}1&-3\\\\-3&10\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}10&-3\\\\-3&1\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}-10&3\\\\3&-1\\end{bmatrix}"
      },
      {
        "tex": "\\begin{bmatrix}-3&1\\\\10&-3\\end{bmatrix}"
      }
    ]
  },
  "ITC-MATH-0052": {
    "prompt": [
      {
        "type": "ar",
        "text": "إذا كان "
      },
      {
        "type": "tex",
        "text": "\\cos\\theta=\\frac{9}{15}"
      },
      {
        "type": "ar",
        "text": " حيث إن "
      },
      {
        "type": "tex",
        "text": "\\theta"
      },
      {
        "type": "ar",
        "text": " زاوية حادة، فأوجد قيمة "
      },
      {
        "type": "tex",
        "text": "\\tan\\theta"
      },
      {
        "type": "ar",
        "text": "."
      }
    ],
    "options": [
      {
        "tex": "\\frac{12}{15}"
      },
      {
        "tex": "\\frac{4}{3}"
      },
      {
        "tex": "\\frac{9}{12}"
      },
      {
        "tex": "\\frac{15}{12}"
      }
    ]
  },
  "ITC-MATH-0053": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد مركز القطع الناقص:"
      },
      {
        "type": "block",
        "text": "\\frac{(x+4)^{2}}{16}+\\frac{(y-1)^{2}}{9}=1"
      }
    ],
    "options": [
      {
        "text": "(4, 1)"
      },
      {
        "text": "(-4, 1)"
      },
      {
        "text": "(-4, -1)"
      },
      {
        "text": "(1, -4)"
      }
    ]
  },
  "ITC-MATH-0054": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد مركز القطع الناقص:"
      },
      {
        "type": "block",
        "text": "\\frac{(x-3)^{2}}{4}+\\frac{(y+2)^{2}}{9}=1"
      }
    ],
    "options": [
      {
        "tex": "(3,2)"
      },
      {
        "tex": "(-3,2)"
      },
      {
        "tex": "(3,-2)"
      },
      {
        "tex": "(-3,-2)"
      }
    ]
  },
  "ITC-MATH-0055": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "حدد رأس القطع المكافئ:"
      },
      {
        "type": "block",
        "text": "y=x^{2}+4x-1"
      }
    ],
    "options": [
      {
        "text": "(2, -5)"
      },
      {
        "text": "(-2, -5)"
      },
      {
        "text": "(-2, 3)"
      },
      {
        "text": "(4, -1)"
      }
    ]
  },
  "ITC-MATH-0056": {
    "layout": "stacked",
    "prompt": [
      {
        "type": "ar",
        "text": "أوجد اتجاه القطع المكافئ التالي:"
      },
      {
        "type": "block",
        "text": "y=2x^{2}-3x+1"
      }
    ],
    "options": [
      {
        "ar": "مفتوح لأعلى"
      },
      {
        "ar": "مفتوح لأسفل"
      },
      {
        "ar": "مفتوح لليمين"
      },
      {
        "ar": "مفتوح لليسار"
      }
    ]
  },
  "ITC-MATH-0050": {
    "prompt": [
      {
        "type": "ar",
        "text": "إذا كان "
      },
      {
        "type": "tex",
        "text": "\\sin\\theta=\\frac{5}{13}"
      },
      {
        "type": "ar",
        "text": " وفي مثلث قائم الزاوية كان طول الضلع المقابل للزاوية "
      },
      {
        "type": "tex",
        "text": "\\theta"
      },
      {
        "type": "ar",
        "text": " يساوي 15، فأوجد طول الوتر."
      }
    ],
    "options": [
      {
        "ar": "26"
      },
      {
        "ar": "39"
      },
      {
        "ar": "65"
      },
      {
        "ar": "52"
      }
    ]
  },
  "ITC-MATH-0051": {
    "prompt": [
      {
        "type": "ar",
        "text": "إذا كان "
      },
      {
        "type": "tex",
        "text": "\\sin\\theta=\\frac{5}{13}"
      },
      {
        "type": "ar",
        "text": " وفي مثلث قائم الزاوية كان طول الضلع المقابل للزاوية "
      },
      {
        "type": "tex",
        "text": "\\theta"
      },
      {
        "type": "ar",
        "text": " يساوي 20، فأوجد طول الوتر."
      }
    ],
    "options": [
      {
        "ar": "26"
      },
      {
        "ar": "39"
      },
      {
        "ar": "65"
      },
      {
        "ar": "52"
      }
    ]
  },
  "ITC-MATH-0057": {
    "svg": `<svg viewBox="0 0 520 330" xmlns="http://www.w3.org/2000/svg" class="fig exact-geo cylinder-geo" role="img" aria-label="أسطوانة نصف قطرها 3 سم وارتفاعها 7 سم">
  <g transform="translate(35,15)">
    <g fill="none" stroke="#111" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="250" cy="80" rx="105" ry="30"/>
      <path d="M145 80 V225"/>
      <path d="M355 80 V225"/>
      <path d="M145 225 C145 241 192 255 250 255 C308 255 355 241 355 225"/>
      <path d="M145 225 C145 209 192 195 250 195 C308 195 355 209 355 225" stroke-dasharray="8 8" opacity=".55"/>
      <line x1="250" y1="80" x2="356" y2="80"/>
      <circle cx="250" cy="80" r="5" fill="#111"/>
    </g>
    <text x="250" y="32" text-anchor="middle" font-size="28" font-family="KaTeX_Main, 'Times New Roman', serif" fill="#111">3 cm</text>
    <text x="394" y="158" text-anchor="middle" font-size="28" font-family="KaTeX_Main, 'Times New Roman', serif" fill="#111">7 cm</text>
  </g>
</svg>`,
    "prompt": [{ "type": "ar", "text": "أوجد حجم الأسطوانة المجاورة:" }],
    "options": [
      { "tex": "197.82\\;cm^{3}" },
      { "tex": "131.88\\;cm^{3}" },
      { "tex": "263.76\\;cm^{3}" },
      { "tex": "21.98\\;cm^{3}" }
    ]
  },
  "ITC-MATH-0058": {
    "svg": `<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" class="fig exact-geo triangle-geo" role="img" aria-label="مثلث QPR، زاوية Q تساوي 65 درجة، زاوية P تساوي 55 درجة، والمطلوب الزاوية الخارجية عند R">
  <defs>
    <marker id="geo58Arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M0 1 L9 5 L0 9 Z" fill="#111"/></marker>
  </defs>
  <g transform="translate(35,12)">
    <g fill="none" stroke="#111" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M88 244 L260 34 L413 244 Z"/>
      <line x1="88" y1="244" x2="515" y2="244" marker-end="url(#geo58Arrow)"/>
      <!-- Thin dark-gray angle markers: ∠RPQ, ∠PQR, and exterior ∠PRS. -->
      <path class="angle-mark" d="M240 64 Q260 80 280 64" stroke="#4a4a50" stroke-width="2.6"/>
      <path class="angle-mark" d="M119 244 A31 31 0 0 0 108 220" stroke="#4a4a50" stroke-width="2.6"/>
      <path class="angle-mark" d="M397 218 A53 53 0 0 1 450 244" stroke="#4a4a50" stroke-width="2.6"/>
    </g>
    <text x="260" y="22" text-anchor="middle" font-size="24" font-family="KaTeX_Main, 'Times New Roman', serif">P</text>
    <text x="75" y="273" text-anchor="middle" font-size="24" font-family="KaTeX_Main, 'Times New Roman', serif">Q</text>
    <text x="414" y="273" text-anchor="middle" font-size="24" font-family="KaTeX_Main, 'Times New Roman', serif">R</text>
    <text x="520" y="273" text-anchor="middle" font-size="24" font-family="KaTeX_Main, 'Times New Roman', serif">S</text>
    <text x="258" y="93" text-anchor="middle" font-size="25" font-family="KaTeX_Main, 'Times New Roman', serif">55°</text>
    <text x="136" y="222" text-anchor="middle" font-size="25" font-family="KaTeX_Main, 'Times New Roman', serif">65°</text>
    <text x="453" y="218" text-anchor="middle" font-size="36" font-family="KaTeX_Main, 'Times New Roman', serif">?</text>
  </g>
</svg>`,
    "prompt": [{ "type": "ar", "text": "ما هو قياس زاوية المثلث الخارجية في المثلث المجاور؟" }],
    "options": [
      { "tex": "55^{\\circ}" },
      { "tex": "65^{\\circ}" },
      { "tex": "120^{\\circ}" },
      { "tex": "60^{\\circ}" }
    ]
  },
  "ITC-MATH-0059": {
    "svg": `<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" class="fig exact-geo trapezoid-geo" role="img" aria-label="شبه منحرف قاعدتاه 8 سم و14 سم وارتفاعه 5 سم">
  <g transform="translate(42,18)">
    <g fill="none" stroke="#111" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M60 218 L105 68 H375 L465 218 Z"/>
      <line x1="105" y1="68" x2="105" y2="218" stroke-dasharray="10 9"/>
      <path d="M105 92 H128 V68"/>
      <path d="M105 218 V197"/>
      <path d="M60 218 H465"/>
      <path d="M105 68 H375"/>
    </g>
    <text x="240" y="43" text-anchor="middle" font-size="27" font-family="KaTeX_Main, 'Times New Roman', serif">8 cm</text>
    <rect x="126" y="132" width="74" height="30" fill="#fff"/>
    <text x="163" y="154" text-anchor="middle" font-size="25" font-family="KaTeX_Main, 'Times New Roman', serif">5 cm</text>
    <text x="250" y="260" text-anchor="middle" font-size="27" font-family="KaTeX_Main, 'Times New Roman', serif">14 cm</text>
  </g>
</svg>`,
    "prompt": [{ "type": "ar", "text": "أوجد مساحة شبه المنحرف المجاور:" }],
    "options": [
      { "tex": "110\\;cm^{2}" },
      { "tex": "55\\;cm^{2}" },
      { "tex": "35\\;cm^{2}" },
      { "tex": "70\\;cm^{2}" }
    ]
  },
  "ITC-MATH-0060": {
    "svg": `<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" class="fig exact-geo right-triangle-geo" role="img" aria-label="مثلث قائم، الضلع الرأسي 8 سم، القاعدة 15 سم، والوتر x سم">
  <g transform="translate(42,18)">
    <g fill="none" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M90 32 L90 235 L400 235"/>
      <line x1="90" y1="32" x2="400" y2="235"/>
      <line x1="400" y1="235" x2="500" y2="235"/>
      <path d="M90 207 H118 V235"/>
    </g>
    <text x="70" y="29" text-anchor="middle" font-size="27" font-family="KaTeX_Main, 'Times New Roman', serif">A</text>
    <text x="72" y="264" text-anchor="middle" font-size="27" font-family="KaTeX_Main, 'Times New Roman', serif">C</text>
    <text x="407" y="222" text-anchor="start" font-size="27" font-family="KaTeX_Main, 'Times New Roman', serif">B</text>
    <text x="46" y="142" text-anchor="middle" font-size="27" font-family="KaTeX_Main, 'Times New Roman', serif" direction="ltr" unicode-bidi="isolate">8 cm</text>
    <text x="235" y="268" text-anchor="middle" font-size="29" font-family="KaTeX_Main, 'Times New Roman', serif">15 cm</text>
    <text x="245" y="126" text-anchor="middle" font-size="29" font-family="KaTeX_Main, 'Times New Roman', serif" transform="rotate(33 245 126)">x cm</text>
  </g>
</svg>`,
    "prompt": [{ "type": "ar", "text": "أوجد طول الضلع المجهول في الشكل التالي:" }],
    "options": [
      { "tex": "14" },
      { "tex": "64" },
      { "tex": "23" },
      { "tex": "17" }
    ]
  }

};
