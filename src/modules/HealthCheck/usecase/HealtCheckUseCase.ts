import { injectable } from 'inversify';

import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { HealtCheckDao } from '@infrastructure/bd/postgresql/dao/HealtCheckDao';

@injectable()
export class HealtCheckUseCase {
    private healtCheckDao = GLOBAL_CONTAINER.get(HealtCheckDao);

    async healtCheckDB(): Promise<void> {
        await this.healtCheckDao.healtCheckDB();
    }
}
