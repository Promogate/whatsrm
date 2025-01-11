import 'module-alias/register';
import { addAliases } from 'module-alias';

addAliases({
  "@": `${__dirname}`,
  "@core": `${__dirname}/core`,
  "@infrastructure": `${__dirname}/infrastructure`,
  "@interfaces": `${__dirname}/interfaces`,
  "@shared": `${__dirname}/shared`,
  "@tests": `${__dirname}/tests`,
  "@application": `${__dirname}/application`
});