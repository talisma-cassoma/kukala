
import type { Image } from './Image';
import type { Video } from './Video';

export type Paragraph = {
    title: { text: string };
    //body: { json: any };
    text: string;
    images: Image[];
    videos?: Video[];
};