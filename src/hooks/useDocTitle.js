import { useEffect } from 'react';

const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - E-Com`;
        } else {
            document.title = 'E-Com | The Perfect E_Com Market Place';
        }
    }, [title]);

    return null;
};

export default useDocTitle;
