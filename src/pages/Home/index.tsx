import React, { useEffect, useRef } from 'react';
import HomeCarousel from '../../components/Home/HomeCarousel';
import Media from '../../components/Home/Media';
import WasteStatus from '../../components/Home/WasteStatus';
import VideoSection from '../../components/Home/VideoSection';
import Partners from '../../components/Home/Partners';

const Home: React.FC = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const mediaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let lastScrollTop = 0;

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const scrollDirection = currentScroll > lastScrollTop ? 'down' : 'up';
            
            if (carouselRef.current && mediaRef.current) {
                const carouselBottom = carouselRef.current.getBoundingClientRect().bottom;
                const mediaTop = mediaRef.current.getBoundingClientRect().top;

                // Scrolling down from carousel to media
                if (scrollDirection === 'down' && carouselBottom > 0 && carouselBottom < window.innerHeight) {
                    mediaRef.current.scrollIntoView({ behavior: 'smooth' });
                }

                // Scrolling up from media to carousel
                if (scrollDirection === 'up' && mediaTop > -100 && mediaTop < 100) {
                    carouselRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }

            lastScrollTop = currentScroll;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home">
            <div ref={carouselRef}>
                <HomeCarousel />
            </div>
            <div ref={mediaRef}>
                <Media/>
            </div>
            <WasteStatus/>
            <VideoSection/>
            <Partners/>
        </div>
    );
};

export default Home;