import JsonTool from "./JsonTool";
import Base64Tool from "./Base64Tool";
import UrlTool from "./UrlTool";
import HashTool from "./HashTool";
import JwtTool from "./JwtTool";
import BaseTool from "./BaseTool";
import CsvTool from "./CsvTool";
import MarkdownTool from "./MarkdownTool";
import HtmlTool from "./HtmlTool";
import AiTool from "./AiTool";
import EmailTool from "./EmailTool";
import RegexTool from "./RegexTool";
import DiffTool from "./DiffTool";
import CaseTool from "./CaseTool";
import UuidTool from "./UuidTool";
import LoremTool from "./LoremTool";
import CronTool from "./CronTool";
import TimestampTool from "./TimestampTool";
import QrTool from "./QrTool";
import ImageTool from "./ImageTool";
import ColorTool from "./ColorTool";
import SqlTool from "./SqlTool";
import PasswordTool from "./PasswordTool";
import UnitConverterTool from "./UnitConverterTool";
import HtmlEntitiesTool from "./HtmlEntitiesTool";
import NumberFormatterTool from "./NumberFormatterTool";
import YamlJsonTool from "./YamlJsonTool";
import TextStatsTool from "./TextStatsTool";

// Single source of truth for tool ID → component mapping.
// Consumed by App.jsx via TOOL_MAP and by data/tools.js via TOOL_COMPONENTS
// when merging registries in the future.
export const TOOL_COMPONENTS = {
  ai: AiTool,
  json: JsonTool,
  base64: Base64Tool,
  url: UrlTool,
  hash: HashTool,
  jwt: JwtTool,
  base: BaseTool,
  csv: CsvTool,
  markdown: MarkdownTool,
  html: HtmlTool,
  email: EmailTool,
  regex: RegexTool,
  diff: DiffTool,
  caseconv: CaseTool,
  entities: HtmlEntitiesTool,
  textstats: TextStatsTool,
  uuid: UuidTool,
  lorem: LoremTool,
  password: PasswordTool,
  cron: CronTool,
  timestamp: TimestampTool,
  units: UnitConverterTool,
  numfmt: NumberFormatterTool,
  image: ImageTool,
  color: ColorTool,
  qr: QrTool,
  sql: SqlTool,
  yaml: YamlJsonTool,
};

// Backwards-compat alias used by App.jsx
export const TOOL_MAP = TOOL_COMPONENTS;
