import { ContentTransformer, Image } from "@crystallize/reactjs-components";
import ReactPlayer from "react-player";
import { type ProductBodyType } from "../use-cases/contracts/ProductContent";

export const ProductBody = ({ body, table }: ProductBodyType) => {
    return (
        <div className="flex flex-col gap-3 my-10 lg:w-9/12 w-full mx-auto z-10">
            {body?.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex flex-col justify-between">
                    <div className="my-3 text-text md:px-20">
                        {paragraph.title && (
                            <h2 className="font-semibold text-2xl mb-4">
                                {paragraph.title?.text}
                            </h2>
                        )}
                        <p>
                            {paragraph.text}
                        </p>
                    </div>
                    {paragraph.images && (
                        <div className="my-5 mx-auto">
                            {paragraph?.images?.map((image, index: number) => (
                                <img
                                    src={image.url}
                                    alt={image.altText}
                                    //srcSet={`${image.url}?w=200 200w, ${image.url}?w=300 300w`}
                                    sizes="200px"
                                    className="rounded-xl overflow-hidden aspect-448/404 m-10 w-180"
                                    loading="lazy"
                                    // width="500px"
                                    // height="400px"
                                />
                            ))}
                        </div>
                    )}
                    {paragraph.videos && paragraph.videos?.length > 0 && (
                        <div className="my-5">
                            <ReactPlayer
                                controls
                                url={paragraph?.videos[0]?.playlists?.[1]}
                                width="100%"
                                height="400px"
                                light={
                                    paragraph?.videos &&
                                    paragraph?.videos.length > 0 &&
                                    paragraph?.videos[0].thumbnails &&
                                    paragraph?.videos[0].thumbnails.length >
                                        0 &&
                                    paragraph?.videos[0].thumbnails[0].url
                                }
                                playing={true}
                            />
                        </div>
                    )}
                </div>
            ))}
            {table?.sections.map((section, index) => (
                <div
                    key={index}
                    className="flex lg:flex-row flex-col justify-between text-text my-20"
                >
                    <div>
                        <h3 className="font-bold text-2xl py-2">
                            {section?.title}
                        </h3>
                        <p className="italic">per 50 g</p>
                    </div>
                    <div className="lg:w-7/12 w-full">
                        {section.properties.map((property, index) => (
                            <div
                                key={index}
                                className="flex justify-between my-3 even:bg-grey px-5 py-2"
                            >
                                <p>{property.key}</p>
                                <p>{property.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
