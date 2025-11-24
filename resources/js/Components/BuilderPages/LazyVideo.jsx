// components/Builder/LazyVideo.jsx
import useLazyLoad from '@/hooks/Builder/useLazyLoad';
import React, { useRef } from 'react';

const LazyVideo = ({ src, title }) => {
    const videoRef = useRef(null);
    const isVisible = useLazyLoad(videoRef);

    return (
        <div ref={videoRef} style={{ height: '200px', backgroundColor: '#f0f0f0' }}>
            {isVisible ? (
                <iframe
                    width="100%"
                    height="200"
                    src={src}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <p>Cargando video...</p>
                </div>
            )}
        </div>
    );
};

export default LazyVideo;