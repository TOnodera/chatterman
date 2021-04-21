import { launch } from './launch';
import logger from './Utility/logger';
import Config from './Config';
launch(Config.system.prod_port);
logger.info(Config.system.prod_port);