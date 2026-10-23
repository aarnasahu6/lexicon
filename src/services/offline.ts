import { ExplanationRequest, Language, ResultSchema } from "../data/types";
import { terms } from "../data/terms";
type Scenario = {
  title: string;
  inputs: Record<Language, string>;
  simple: string;
  professional: string;
  concepts: string[];
  hi: string;
  es: string;
  why: string;
};
export const scenarios: Scenario[] = [
  {
    title: "Growing efficiently",
    inputs: {
      English: "We are selling more without increasing our fixed costs.",
      "Hindi / Hinglish":
        "Hamari sales badh rahi hain bina fixed costs badhaye.",
      Spanish: "Vendemos más sin aumentar los costos fijos.",
    },
    simple:
      "Sales are increasing while fixed costs stay unchanged. Profitability also depends on variable costs.",
    professional:
      "Revenue growth against a stable fixed-cost base may support positive operating leverage.",
    concepts: ["Operating leverage", "Revenue", "Operating expenses"],
    hi: "Fixed costs stable hain aur sales badh rahi hain. Profit par variable costs ka bhi asar hoga.",
    es: "Las ventas crecen y los costos fijos se mantienen; la rentabilidad también depende de los costos variables.",
    why: "Use this when discussing cost structure. It does not prove that profit increased.",
  },
  {
    title: "Keeping clients",
    inputs: {
      English: "We want more of our existing customers to stay with us.",
      "Hindi / Hinglish":
        "Hum chahte hain ki hamare existing customers hamare saath bane rahein.",
      Spanish: "Queremos que más clientes actuales sigan con nosotros.",
    },
    simple: "The team wants to keep more of the customers it already serves.",
    professional:
      "We aim to improve client retention through a more consistent service experience.",
    concepts: ["Client retention", "Revenue"],
    hi: "Existing clients ko retain karna goal hai; result measure karne ke liye time period define karein.",
    es: "El objetivo es conservar clientes; hay que definir el período para medir el resultado.",
    why: "This states a goal, not a completed improvement. Define a baseline before reporting success.",
  },
  {
    title: "Choosing where money goes",
    inputs: {
      English:
        "We need to decide how much money to reinvest and how much to return to shareholders.",
      "Hindi / Hinglish":
        "Humein decide karna hai kitna paisa reinvest karein aur kitna shareholders ko dein.",
      Spanish:
        "Debemos decidir cuánto reinvertir y cuánto devolver a los accionistas.",
    },
    simple:
      "The company is deciding how to divide available resources between business investment and shareholder distributions.",
    professional:
      "Our capital allocation priorities balance reinvestment with shareholder distributions through dividends or share buybacks.",
    concepts: ["Capital allocation", "Dividend", "Share buybacks"],
    hi: "Business mein reinvestment aur shareholders ko payments ke beech resources balance karne hain.",
    es: "Se busca equilibrar la reinversión con distribuciones a accionistas mediante dividendos o recompras.",
    why: "Use this to explain a funding decision. Buybacks and dividends have different effects and are not guaranteed.",
  },
  {
    title: "Planning a rollout",
    inputs: {
      English:
        "The new service could take longer and cost more to launch than we planned.",
      "Hindi / Hinglish":
        "Nayi service launch karne mein planned se zyada time aur paisa lag sakta hai.",
      Spanish:
        "El lanzamiento del nuevo servicio podría tardar más y costar más de lo previsto.",
    },
    simple: "The launch may face delays or costs above the original plan.",
    professional:
      "The rollout carries execution risk, including potential schedule delays and cost overruns.",
    concepts: ["Execution risk", "Operating expenses"],
    hi: "Rollout mein delays aur extra costs ka execution risk hai; yeh possibility hai, confirmed outcome nahi.",
    es: "El lanzamiento presenta riesgo de ejecución por posibles retrasos y sobrecostos; aún no son resultados confirmados.",
    why: "Name the specific uncertainty so a team can plan milestones and contingencies.",
  },
  {
    title: "Rising costs",
    inputs: {
      "Hindi / Hinglish":
        "Company ke expenses bahut badh rahe hain but sales utni nahi badh rahi.",
      Spanish:
        "Los gastos de la empresa están creciendo mucho, pero las ventas no crecen al mismo ritmo.",
      English: "The company’s expenses are rising much faster than its sales.",
    },
    simple:
      "The company’s costs are growing faster than its sales, putting pressure on operating profitability.",
    professional:
      "Operating expenses are outpacing revenue growth, putting downward pressure on operating margins.",
    concepts: ["Operating margin compression", "Operating expenses", "Revenue"],
    hi: "Company ke operating expenses, revenue se tez badh rahe hain. Isse operating margin par pressure aa raha hai.",
    es: "Los gastos operativos crecen más rápido que los ingresos, lo que presiona el margen operativo.",
    why: "A business can sell more yet become less profitable per dollar of revenue if costs grow faster.",
  },
  {
    title: "Paying bills",
    inputs: {
      "Hindi / Hinglish":
        "Company ke paas abhi bills pay karne ke liye cash kam hai.",
      Spanish:
        "La empresa tiene poco efectivo para pagar sus facturas próximas.",
      English: "The company is short of cash to pay its upcoming bills.",
    },
    simple: "The company may struggle to meet its near-term cash obligations.",
    professional:
      "The company faces near-term liquidity constraints that may affect its ability to meet payment obligations.",
    concepts: ["Liquidity", "Cash flow", "Liabilities"],
    hi: "Company ko short-term bills pay karne mein liquidity constraints ho sakte hain. Profit aur available cash alag cheezein hain.",
    es: "La empresa tiene restricciones de liquidez a corto plazo. Tener beneficios no implica disponer de efectivo.",
    why: "A profitable company can still struggle to pay bills if cash is tied up or receipts arrive late.",
  },
  {
    title: "New investors",
    inputs: {
      "Hindi / Hinglish":
        "Naye shares issue hone se mera ownership percentage kam ho gaya.",
      Spanish:
        "Mi porcentaje de participación bajó cuando se emitieron nuevas acciones.",
      English:
        "My ownership percentage fell when the company issued new shares.",
    },
    simple:
      "More shares now exist, so the investor owns a smaller percentage of the company.",
    professional:
      "The new equity issuance diluted the investor’s ownership stake.",
    concepts: ["Dilution", "Equity", "Valuation"],
    hi: "Naye shares issue hone se ownership stake dilute hua. Iska matlab investment ki total value zaroor giri ho, aisa nahi hai.",
    es: "La emisión de nuevas acciones diluyó la participación. Esto no significa necesariamente que el valor total de la inversión haya caído.",
    why: "Ownership percentage and investment value are different. The impact on value depends on the issue price and how the new capital is used.",
  },
  {
    title: "Buying equipment",
    inputs: {
      "Hindi / Hinglish":
        "Company nayi machines kharidne par paisa laga rahi hai.",
      Spanish: "La empresa está invirtiendo dinero en maquinaria nueva.",
      English: "The company is spending money on new machinery.",
    },
    simple: "The business is buying equipment it expects to use over time.",
    professional:
      "The company is making capital expenditures to acquire new production equipment.",
    concepts: ["Capital expenditure", "Assets", "Free cash flow"],
    hi: "Nayi machines par spending capital expenditure hai. Isse abhi free cash flow kam ho sakta hai.",
    es: "La compra de maquinaria es una inversión en activos de largo plazo y puede reducir el flujo de caja libre actual.",
    why: "A long-term investment uses cash today but may provide benefits over several years.",
  },
  {
    title: "Borrowing to grow",
    inputs: {
      "Hindi / Hinglish": "Company expansion ke liye loan le rahi hai.",
      Spanish: "La empresa está pidiendo un préstamo para expandirse.",
      English: "The company is borrowing money to fund its expansion.",
    },
    simple: "The business is taking on debt to pay for growth.",
    professional:
      "The company is using debt financing to fund its expansion, increasing financial leverage.",
    concepts: ["Debt", "Leverage", "Liabilities"],
    hi: "Expansion ko debt se fund karne par leverage badhta hai. Interest aur repayment ki obligations bhi badhti hain.",
    es: "Financiar la expansión con deuda aumenta el apalancamiento y las obligaciones de intereses y reembolso.",
    why: "Borrowing can support growth, but repayment obligations continue even if expected growth does not happen.",
  },
  {
    title: "Money in inventory",
    inputs: {
      "Hindi / Hinglish":
        "Hamara paisa stock mein phansa hua hai jo abhi bika nahi.",
      Spanish:
        "Tenemos dinero inmovilizado en inventario que todavía no se ha vendido.",
      English: "Our cash is tied up in inventory that has not sold yet.",
    },
    simple:
      "The business has spent cash on goods that have not yet generated sales.",
    professional:
      "Cash is tied up in unsold inventory, increasing working capital requirements.",
    concepts: ["Working capital", "Liquidity", "Assets"],
    hi: "Unsold inventory mein cash tied up hai. Isse working capital requirement aur liquidity par pressure ho sakta hai.",
    es: "El efectivo está inmovilizado en inventario sin vender, lo que aumenta las necesidades de capital de trabajo.",
    why: "Inventory may be an asset, but it cannot directly pay bills. Its cash impact depends on how quickly it sells and customers pay.",
  },
];
const marginText =
  "Management expects approximately 150 basis points of gross margin compression due to unfavorable product mix.";
export const examples = {
  bridge: scenarios.find((s) => s.title === "Rising costs")!.inputs,
  understand: {
    "Hindi / Hinglish": marginText,
    Spanish: marginText,
    English: marginText,
  },
};
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?‘’'“”"—–-]/g, "")
    .replace(/[:;()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
export function offlineResponse(req: ExplanationRequest) {
  const all = terms(req.language),
    input = normalize(req.input);
  const scenario = scenarios.find((s) =>
    [...Object.values(s.inputs), s.professional].some(
      (v) => normalize(v) === input,
    ),
  );
  if (scenario)
    return ResultSchema.parse({
      responseKind: "scenario",
      simpleMeaning: scenario.simple,
      professionalVersion: scenario.professional,
      concepts: scenario.concepts.map((n) => all.find((t) => t.term === n)),
      localizedExplanation:
        req.language === "Hindi / Hinglish"
          ? scenario.hi
          : req.language === "Spanish"
            ? scenario.es
            : scenario.simple,
      whyItMatters: scenario.why,
    });
  if (input === normalize(marginText))
    return ResultSchema.parse({
      responseKind: "scenario",
      simpleMeaning:
        "Management expects gross margin to fall by 1.5 percentage points because sales are shifting toward less profitable products. For example, a 40% margin would become 38.5%.",
      professionalVersion:
        "Management anticipates a 150-basis-point contraction in gross margin, driven by an unfavorable sales mix.",
      concepts: ["Basis points", "Gross margin", "Product mix"].map((n) =>
        all.find((t) => t.term === n),
      ),
      localizedExplanation:
        req.language === "Hindi / Hinglish"
          ? "150 basis points ka matlab 1.5 percentage points hai. Lower-margin products zyada bikne se gross margin girne ki expectation hai."
          : req.language === "Spanish"
            ? "Se espera que el margen bruto caiga 1,5 puntos porcentuales por vender una mayor proporción de productos con menor margen."
            : "150 basis points equals 1.5 percentage points. A less favorable product mix may reduce the share of revenue kept as gross profit.",
      whyItMatters:
        "The company may keep less gross profit from each dollar of sales. This describes an expectation, not a confirmed result.",
    });
  const aliases: Record<string, string[]> = {
    "Earnings per share": ["eps", "diluted eps", "beneficio por acción"],
    "Pre-tax profit margin": ["pretax profit margin", "pre tax profit margin"],
    "Share buybacks": ["share repurchases", "buybacks", "recompras"],
    Dividend: ["dividends", "dividendos"],
    "Operating leverage": ["apalancamiento operativo"],
    "Client retention": ["customer retention", "retención de clientes"],
    "Capital allocation": ["asignación de capital"],
    "Year-over-year growth": ["yoy", "year over year growth"],
    "Forward-looking statements": ["forward looking statement"],
    Revenue: ["sales", "ventas", "ingresos"],
    Liquidity: ["liquidez"],
    Debt: ["loan", "préstamo", "deuda"],
    Equity: ["patrimonio"],
    Assets: ["activos"],
    Liabilities: ["pasivos"],
    "Working capital": ["capital de trabajo"],
    "Cash flow": ["flujo de caja"],
    "Gross margin": ["margen bruto"],
    "Operating margin": ["margen operativo"],
    "Net income": ["beneficio neto"],
    Dilution: ["dilución"],
  };
  const matches = all.filter((t) =>
    [t.term, ...(aliases[t.term] || [])].some((n) =>
      new RegExp("(?:^|\\s)" + normalize(n) + "(?:$|\\s)").test(input),
    ),
  );
  const selected = matches.slice(0, 8);
  if (!selected.length)
    throw new Error(
      "No matching term yet. Choose a situation above, try the example, or look up a term such as liquidity, revenue, or EBITDA. This offline edition does not generate new rewrites.",
    );
  return ResultSchema.parse({
    responseKind: "glossary",
    simpleMeaning: selected
      .map((t) => `${t.term}: ${t.definition}`)
      .join("\n\n"),
    professionalVersion: selected[0].example,
    concepts: selected,
    localizedExplanation: selected
      .map((t) => t.localizedExplanation)
      .join("\n\n"),
    whyItMatters:
      "These are definitions of up to eight matching terms, with an example of professional usage. They do not interpret or rewrite your full statement.",
  });
}
export async function explain(req: ExplanationRequest) {
  if (!req.input.trim() || req.input.length > 5000)
    throw new Error("Enter between 1 and 5,000 characters.");
  return offlineResponse(req);
}
