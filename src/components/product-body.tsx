import { ContentTransformer, Image } from "@crystallize/reactjs-components";
import ReactPlayer from "react-player";
import { type ProductBodyType } from "@/use-cases/contracts/ProductContent";

export const ProductBody = ({ body, table }: ProductBodyType) => {

    console.log("ProductBody received body:", JSON.stringify(body));
    //console.log("ProductBody received table:", JSON.stringify(table));
    return (
        <div className="flex mx-auto flex-col gap-3 my-10 lg:w-9/12 w-full max-w-160 z-10">
            {body?.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex flex-col justify-between">
                    <div className="my-3 text-text md:px-20">
                        {paragraph.title && (
                            <h2 className="font-semibold text-2xl mb-4">
                                {paragraph.title?.text}
                            </h2>
                        )}
                        <p className="text-text text-sm">
                            {paragraph?.text}
                        </p>
                    </div>
                    {paragraph.images[index] && (
                        <div className="my-5 mx-auto">
                            <img
                                src={paragraph?.images[index].url}
                                alt={paragraph?.images[index].altText}
                                className="rounded-xl overflow-hidden max-w-120 m-10 w-180"
                                loading="lazy"
                            />
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
                    className="flex flex-col justify-center text-center my-20"
                >
                    <div className="flex flex-col w-full gap-3">
                        <h3 className="font-bold text-2xl py-2">
                            {section?.title}
                        </h3>
                        <p className="italic text-sm">per 50 g</p>
                    </div>
                    {/* 1. Le conteneur parent Flexbox */}
                    <div className="flex w-full gap-3">

                        {/* Colonne 1 : Votre tableau existant (7/12 de ) */}
                        <div className="w-full">
                            <table className="w-full text-left border-collapse">
                                <thead >
                                    <tr className="w-full border-b border-black text-sm font-semibold text-gray-700">
                                        <th className="w-1/2 px-5 py-3">Prop</th>
                                        <th className="w-1/2 px-5 py-3">Qté</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-transparent text-gray-700 text-sm">
                                    {section.properties.map((property, index) => (
                                        <tr
                                            key={index}
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
