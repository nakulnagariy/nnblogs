import { makePage } from '@keystatic/next/ui/app';
import keystaticConfig from '../../../../keystatic.config';

export const dynamic = 'force-static';

export default makePage(keystaticConfig);
