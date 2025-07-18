import React, { useEffect, useRef } from 'react';

const InteractiveImageGallery = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const cards = containerRef.current.querySelectorAll('.card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardWidth = cardRect.width;
                const cardHeight = cardRect.height;

                const centerX = cardRect.left + cardWidth / 2;
                const centerY = cardRect.top + cardHeight / 2;
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;

                // Calculate rotation
                const rotateX = Math.max(Math.min((mouseY / cardHeight) * 75, 75), -75); // Reduce to 75 for smoother tilt
                const rotateY = Math.max(Math.min((mouseX / cardWidth) * -75, 75), -75); // Reduce to 75 for smoother tilt

                // Apply transform using requestAnimationFrame for smoother animation
                requestAnimationFrame(() => {
                    card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
                });
            });

            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                    card.style.willChange = 'transform';
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                });
            });

        });

        // Cleanup event listeners when component unmounts
        return () => {
            cards.forEach(card => {
                card.removeEventListener('mousemove', () => { });
                card.removeEventListener('mouseleave', () => { });
            });
        };
    }, []);

    const images = [
        'https://images.pexels.com/photos/10643964/pexels-photo-10643964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/27578999/pexels-photo-27578999/free-photo-of-3d-render.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/11643390/pexels-photo-11643390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/18108322/pexels-photo-18108322/free-photo-of-3d-3d-render.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1270184/pexels-photo-1270184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/937980/pexels-photo-937980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ];

    return (
        <div className="bg-gray-100 dark:bg-black min-h-screen py-10">
            <div className="container mx-auto font-primary">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
                    Interactive Image Gallery
                </h1>

                <div
                    ref={containerRef}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="card relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800"
                        >
                            <img
                                src={image}
                                alt={'Image ' + (index + 1)}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InteractiveImageGallery;
