import React, { useEffect, useRef } from 'react';

import '../../../../node_modules/lightwind/plugin';

const cardData = [
    {
        name: 'Rajesh',
        username: '@rajesh',
        avatar: 'https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png',
        quote: "Lightwind has completely transformed my design workflow. The smooth animations and clean UI are incredible!"
    },
    {
        name: 'Aishwarya',
        username: '@aishwarya',
        avatar: 'https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png',
        quote: "The user experience is top-notch. I love how everything feels so intuitive and responsive. Truly a game changer."
    },
    {
        name: 'Vikram',
        username: '@vikram',
        avatar: 'https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png',
        quote: "I’m blown away by the sleek design and smooth transitions. Lightwind has set a new standard for web design!"
    },
    {
        name: 'Priya',
        username: '@priya',
        avatar: 'https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png',
        quote: "A beautiful design experience. I can’t imagine working without Lightwind now. It’s so smooth and aesthetically pleasing."
    },
    {
        name: 'Amit',
        username: '@amit',
        avatar: 'https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png',
        quote: "Lightwind has taken my projects to the next level. The responsiveness and performance are unbeatable!"
    },
    {
        name: 'Neha',
        username: '@neha',
        avatar: 'https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png',
        quote: "Such a simple yet powerful tool. The design elements and animations are perfect for creating a premium feel!"
    },
    {
        name: 'Suresh',
        username: '@suresh',
        avatar: 'https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png',
        quote: "I’m obsessed with how modern and clean the design is. Lightwind makes it so easy to create beautiful websites."
    }
];

const Card = ({ name, username, avatar, quote }) => (
    <figure className="GlassMarqueeCard w-72 h-44 cursor-pointer overflow-hidden rounded-xl p-5 backdrop-blur-lg GlassMarqueeEffect border border-black/30 
    dark:border-white/10 shadow-lg hover:brightness-110 hover:border-white/40 transition-all duration-300 dark:hover:brightness-110 dark:hover:border-white/40">
        <div className="flex items-center gap-4">
            <img
                className="rounded-full border-2 border-gray-500 dark:border-gray-100 w-10 h-10"
                alt={name}
                src={avatar}
            />
            <div className="flex flex-col">
                <figcaption className="text-md font-bold text-black dark:text-gray-100">{name}</figcaption>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">{username}</p>
            </div>
        </div>
        <blockquote className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3 whitespace-normal italic">
            “{quote}”
        </blockquote>
    </figure>
);

const GlassmorphismMarquee = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        if (marqueeRef.current) {
            marqueeRef.current.style.animationPlayState = 'running';
        }
    }, []);

    return (
        <div className="flex items-center justify-center w-screen min-h-screen bg-white dark:bg-black overflow-hidden font-primarylw relative isolate mx-auto max-w-7xl">
            <div
                id="marquee-container"
                className="GlassMarqueeContainer text-gray-800 dark:text-gray-100"
                ref={marqueeRef}
            >
                {[...cardData, ...cardData].map((card, index) => (
                    <Card key={index} {...card} />
                ))}
            </div>
        </div>
    );
};

export default GlassmorphismMarquee;

