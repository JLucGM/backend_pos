// components/Builder/components/VideoComponent.jsx
import React from 'react';
import LazyVideo from './LazyVideo';

const VideoComponent = ({ comp, onEdit, isPreview }) => (
    <div onDoubleClick={isPreview ? undefined : () => onEdit(comp)}>
        <LazyVideo src={comp.content} title="Video" />
    </div>
);

export default VideoComponent;
