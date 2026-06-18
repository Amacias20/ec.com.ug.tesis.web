import { ScrollTop } from 'primereact/scrolltop';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  target: "window" | "parent";
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ target }) => {
    const location = useLocation();
    const shouldShow = !location.pathname.includes('/catalogs');

    if (!shouldShow) return null;

    return (
        <ScrollTop
            target={target}
            style={{ borderRadius: '100%', backgroundColor: '#183d5b', color: 'white' }}
            icon="pi pi-arrow-up text-base"
        />
    );
};

export default ScrollToTop;
