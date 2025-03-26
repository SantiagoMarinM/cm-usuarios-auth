import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { HealtCheckUseCase } from '../usecase/HealtCheckUseCase';
import TYPESDEPENDENCIES from './TypesDependencies';

const createDependenciesHealCheck = (): void => {
    GLOBAL_CONTAINER.bind<HealtCheckUseCase>(TYPESDEPENDENCIES.HealtCheckUseCase)
        .to(HealtCheckUseCase)
        .inSingletonScope();
    GLOBAL_CONTAINER.bind(HealtCheckUseCase).toSelf().inSingletonScope();
};

export default createDependenciesHealCheck;
