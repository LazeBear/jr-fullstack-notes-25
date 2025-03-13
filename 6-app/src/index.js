const config = require('./utils/config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('./middleware/morgan.middleware');
const rateLimit = require('./middleware/rateLimit.middleware');
const { logger } = require('./utils/logger');
const v1Router = require('./routes');
const connectToDb = require('./utils/db');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan);
app.use(rateLimit);
app.use(express.json());

app.use('/v1', v1Router);

connectToDb();

app.listen(config.PORT, () => {
  logger.info(`server listening on port ${config.PORT}`);
});
