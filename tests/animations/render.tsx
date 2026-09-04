import { renderToString } from "react-dom/server";
import { Fixture } from "./fixture";

process.stdout.write(renderToString(<Fixture />));
