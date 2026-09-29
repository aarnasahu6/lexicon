import { Concept, Language } from "./types";
type Entry = [string, string, string, string, string];
const entries: Entry[] = [
  [
    "Revenue",
    "Money earned from selling goods or services, before expenses.",
    "Sales se aane wali total income, expenses se pehle.",
    "Ingresos por ventas antes de restar los gastos.",
    "Revenue grew 12% year over year.",
  ],
  [
    "EBITDA",
    "Earnings before interest, taxes, depreciation and amortization. It is not the same as cash flow.",
    "Interest, tax, depreciation aur amortization se pehle ki earnings. Yeh cash flow nahi hai.",
    "Beneficio antes de intereses, impuestos, depreciación y amortización; no equivale al flujo de caja.",
    "Adjusted EBITDA excludes certain items and should be reconciled to reported earnings.",
  ],
  [
    "Gross margin",
    "Revenue minus cost of goods sold, divided by revenue, expressed as a percentage.",
    "Revenue mein se direct product costs hataane ke baad bacha percentage.",
    "Porcentaje de los ingresos que queda tras restar el costo de los bienes vendidos.",
    "Gross margin fell from 40% to 38.5%.",
  ],
  [
    "Operating margin",
    "Operating income divided by revenue, expressed as a percentage.",
    "Revenue ka kitna percent operating profit banta hai.",
    "Porcentaje de ingresos que se convierte en beneficio operativo.",
    "Operating margin improved as costs grew more slowly than sales.",
  ],
  [
    "Net income",
    "Profit remaining after all expenses, interest and taxes.",
    "Saare expenses, interest aur taxes ke baad bacha profit.",
    "Beneficio restante después de todos los gastos, intereses e impuestos.",
    "The company reported positive net income this quarter.",
  ],
  [
    "Free cash flow",
    "Commonly, cash from operations minus capital expenditure. Definitions can vary.",
    "Aam taur par operating cash flow minus capital expenditure.",
    "Generalmente, flujo de caja operativo menos inversiones en activos de largo plazo.",
    "Free cash flow rose after capital spending declined.",
  ],
  [
    "Liquidity",
    "The ability to meet near-term cash obligations; for an asset, how easily it can be sold for cash.",
    "Short-term payments ke liye cash ki availability; asset ko cash mein badalne ki aasani bhi.",
    "Capacidad de atender pagos próximos; también la facilidad de convertir un activo en efectivo.",
    "Strong liquidity helps the company pay suppliers on time.",
  ],
  [
    "Working capital",
    "Current assets minus current liabilities.",
    "Current assets minus current liabilities: short-term financial cushion.",
    "Activos corrientes menos pasivos corrientes.",
    "Higher inventory can tie up working capital.",
  ],
  [
    "Valuation",
    "An estimate of what a business or asset is worth.",
    "Business ya asset ki estimated value.",
    "Estimación del valor de una empresa o un activo.",
    "The valuation depends on growth assumptions.",
  ],
  [
    "Dilution",
    "A reduction in an existing investor’s ownership percentage when new shares are issued.",
    "Naye shares issue hone se existing investor ka ownership percentage kam hona.",
    "Reducción del porcentaje de propiedad de un inversor al emitir nuevas acciones.",
    "The new share issuance may cause dilution.",
  ],
  [
    "Equity",
    "Ownership in a business; on a balance sheet, assets minus liabilities.",
    "Business mein ownership; balance sheet par assets minus liabilities.",
    "Participación en una empresa; en el balance, activos menos pasivos.",
    "The business raised equity to fund expansion.",
  ],
  [
    "Debt",
    "Borrowed money that must be repaid, usually with interest.",
    "Borrow kiya hua paisa jo aam taur par interest ke saath repay hota hai.",
    "Dinero prestado que debe devolverse, normalmente con intereses.",
    "The company refinanced its debt.",
  ],
  [
    "Leverage",
    "Use of debt to finance assets or operations, which can amplify gains and losses.",
    "Debt use karke business fund karna; gains aur losses dono badh sakte hain.",
    "Uso de deuda para financiar activos u operaciones, amplificando ganancias y pérdidas.",
    "Higher leverage increases financial risk.",
  ],
  [
    "Basis points",
    "One basis point is 0.01 percentage point; 100 basis points equal 1 percentage point.",
    "1 basis point = 0.01 percentage point; 150 basis points = 1.5 percentage points.",
    "Un punto básico equivale a 0,01 puntos porcentuales; 150 equivalen a 1,5 puntos porcentuales.",
    "The interest rate increased by 25 basis points.",
  ],
  [
    "Capital expenditure",
    "Spending to acquire or improve long-term assets such as equipment.",
    "Equipment jaise long-term assets kharidne ya improve karne par spending.",
    "Inversión para adquirir o mejorar activos de largo plazo, como maquinaria.",
    "Capital expenditure includes the new production equipment.",
  ],
  [
    "Operating expenses",
    "Costs of running the business, such as salaries, rent and administration.",
    "Business chalaane ke expenses, jaise salaries, rent aur administration.",
    "Gastos de funcionamiento, como salarios, alquiler y administración.",
    "Operating expenses grew faster than revenue.",
  ],
  [
    "Cash flow",
    "Cash moving into and out of a business during a period.",
    "Ek period mein business mein aane aur jaane wala cash.",
    "Entradas y salidas de efectivo de una empresa durante un período.",
    "Positive cash flow does not always mean positive net income.",
  ],
  [
    "Assets",
    "Resources controlled by a business that are expected to provide future economic benefits.",
    "Business ke control mein resources jo future mein economic benefit de sakte hain.",
    "Recursos controlados por una empresa que pueden generar beneficios económicos futuros.",
    "Cash, inventory and equipment are assets.",
  ],
  [
    "Liabilities",
    "Present obligations a business owes to others.",
    "Business ki existing obligations, jaise loans aur unpaid bills.",
    "Obligaciones actuales de una empresa frente a terceros.",
    "Accounts payable are current liabilities.",
  ],
  [
    "Return on investment",
    "Net gain from an investment divided by its cost, usually expressed as a percentage.",
    "Investment ka net gain divided by uski cost, percentage mein.",
    "Ganancia neta de una inversión dividida por su costo, expresada como porcentaje.",
    "A $20 gain on a $100 investment is a 20% return on investment.",
  ],
  [
    "Operating margin compression",
    "A decrease in operating profit as a percentage of revenue.",
    "Revenue ke comparison mein operating profit ka percentage girna.",
    "Disminución del beneficio operativo como porcentaje de los ingresos.",
    "Expenses outpacing sales may cause operating margin compression.",
  ],
  [
    "Product mix",
    "The combination of products a company sells; different products may have different margins.",
    "Company ke bikne wale products ka combination; har product ki margin alag ho sakti hai.",
    "Combinación de productos vendidos; cada producto puede tener un margen diferente.",
    "A shift toward lower-margin products reduced gross margin.",
  ],
];
export function terms(language: Language): Concept[] {
  return entries.map(([term, definition, hi, es, example]) => ({
    term,
    definition,
    localizedExplanation:
      language === "Hindi / Hinglish"
        ? hi
        : language === "Spanish"
          ? es
          : definition,
    example,
  }));
}
export const packs = [
  { id: "hi-finance", language: "Hindi / Hinglish", version: 1 },
  { id: "es-finance", language: "Spanish", version: 1 },
];
