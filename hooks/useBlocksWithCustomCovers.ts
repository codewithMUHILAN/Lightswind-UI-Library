import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/config';
import { Block } from '../utils/blocks-data';

export function useBlocksWithCustomCovers(blocks: Block[]) {
    const [blocksWithCustomCovers, setBlocksWithCustomCovers] = useState(blocks);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomCovers = async () => {
            try {
                const docRef = doc(db, 'blocks', 'metadata');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const metadata = docSnap.data();
                    const updatedBlocks = blocks.map(block => {
                        const customCover = metadata[block.id]?.coverImage;
                        return customCover ? { ...block, coverImage: customCover } : block;
                    });
                    setBlocksWithCustomCovers(updatedBlocks);
                } else {
                    setBlocksWithCustomCovers(blocks);
                }
            } catch (error) {
                console.error('Error fetching custom block covers:', error);
                setBlocksWithCustomCovers(blocks);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomCovers();
    }, [blocks]);

    return { blocks: blocksWithCustomCovers, loading };
}
