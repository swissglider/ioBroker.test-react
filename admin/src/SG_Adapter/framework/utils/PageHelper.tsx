import pageConfiguration, { I_PageConfiguration } from '../../configs/RouterConfig';

const findPageByPath = (
    path: string,
    parentPath: string,
    page: I_PageConfiguration,
): I_PageConfiguration | undefined => {
    if (path === parentPath + page.path) return page;
    if (page.subPages !== undefined) {
        for (const sPage of page.subPages) {
            const result = findPageByPath(path, parentPath + page.path, sPage);
            if (result !== undefined) return result;
        }
    }
    return undefined;
};

const getPageByPath = (path: string): I_PageConfiguration | undefined => {
    for (const sPage of pageConfiguration) {
        const result = findPageByPath(path, '', sPage);
        if (result !== undefined) return result;
    }
    return undefined;
};

const getPageProps = (path: string, props: { [key: string]: any } | undefined): { [key: string]: any } | undefined => {
    const page: I_PageConfiguration | undefined = getPageByPath(path);
    const pageConfig =
        page === undefined ? undefined : page.componentProps === undefined ? undefined : page.componentProps;
    if (pageConfig === undefined && props === undefined) return undefined;
    if (pageConfig === undefined && props !== undefined) return props;
    if (pageConfig !== undefined && props === undefined) return pageConfig;

    return { ...pageConfig, ...props };
};

const allNeededPropsAvailable = (allNeededProps: string[], props: { [key: string]: any } | undefined): boolean => {
    if (
        allNeededProps === null ||
        allNeededProps === undefined ||
        Array.isArray(allNeededProps) === false ||
        allNeededProps.length === 0
    ) {
        return true;
    }
    if (props === undefined) return false;
    const keys = Object.keys(props);
    for (const prop of allNeededProps) {
        if (!keys.includes(prop)) return false;
    }
    return true;
};

export default {
    getPageByPath: getPageByPath,
    getPageProps: getPageProps,
    allNeededPropsAvailable: allNeededPropsAvailable,
};
