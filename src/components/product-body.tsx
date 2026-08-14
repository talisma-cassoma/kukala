import ReactPlayer from "react-player";
import { type ProductBodyType } from "@/use-cases/contracts/ProductContent";

export const ProductBody = ({ body, table }: ProductBodyType) => {
    const paragraphs = body?.paragraphs ?? [];
    const sections = table?.sections ?? [];

    return (
        <div className="flex mx-auto flex-col gap-3 my-10 lg:w-9/12 w-full max-w-160 z-10">
            {paragraphs.map((paragraph, index) => {
                const titleText = typeof paragraph.title === 'string'
                    ? paragraph.title
                    : paragraph.title?.text;
                const images = Array.isArray(paragraph.images) ? paragraph.images : [];
                const videos = Array.isArray(paragraph.videos) ? paragraph.videos : [];

                return (
                    <div key={index} className="flex flex-col justify-between">
                        <div className="my-3 text-text md:px-20">
                            {titleText && (
                                <h2 className="font-semibold text-2xl mb-4">
                                    {titleText}
                                </h2>
                            )}
                            {paragraph.text && (
                                <p className="text-text text-sm whitespace-pre-line">
                                    {paragraph.text}
                                </p>
                            )}
                        </div>

                        {images.length > 0 && (
                            <div className="my-5 mx-auto flex flex-wrap gap-4 justify-center">
                                {images.map((img, imgIdx) => (
                                    img?.url ? (
                                        <img
                                            key={imgIdx}
                                            src={img.url}
                                            alt={img.altText || `Image ${imgIdx + 1}`}
                                            className="rounded-xl overflow-hidden max-w-120 m-4 w-full object-contain"
                                            loading="lazy"
                                        />
                                    ) : null
                                ))}
                            </div>
                        )}

                        {videos.length > 0 && (
                            <div className="my-5">
                                <ReactPlayer
                                    controls
                                    url={videos[0]?.playlist || videos[0]?.playlists?.[1] || videos[0]?.playlists?.[0]}
                                    width="100%"
                                    height="400px"
                                    playing={false}
                                />
                            </div>
                        )}
                    </div>
                );
            })}

            {sections.map((section, index) => (
                <div
                    key={index}
                    className="flex flex-col justify-center text-center my-12"
                >
                    <div className="flex flex-col w-full gap-3 mb-4">
                        <h3 className="font-bold text-2xl py-2 text-text">
                            {section?.title}
                        </h3>
                    </div>
                    <div className="flex w-full gap-3">
                        <div className="w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="w-full border-b border-black text-sm font-semibold text-gray-700">
                                        <th className="w-1/2 px-5 py-3">Prop</th>
                                        <th className="w-1/2 px-5 py-3">Qté</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-transparent text-gray-700 text-sm">
                                    {(section.properties ?? []).map((property, pIdx) => (
                                        <tr
                                            key={pIdx}
                                            className="border-b border-black even:bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <td className="px-5 py-2 font-medium">{property.key}</td>
                                            <td className="px-5 py-2 text-gray-600">{property.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
