import launch from './launch';
import logger from './Utility/logger';
const port: number = 3000;
launch(port);

logger.info(process.env.NODE_ENV);