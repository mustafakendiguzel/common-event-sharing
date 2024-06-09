import authModule from '../app/auth/auth.module';
import eventModule from '../app/event/event.module';
import fileModule from '../app/file/file.module';
import express from 'express';
import userModule from '../app/user/user.module';

const apiRouter = express.Router();

apiRouter.use('/auth', authModule.router);
apiRouter.use('/file', fileModule.router);
apiRouter.use('/event', eventModule.router);
apiRouter.use('/user', userModule.router);

export default apiRouter;
