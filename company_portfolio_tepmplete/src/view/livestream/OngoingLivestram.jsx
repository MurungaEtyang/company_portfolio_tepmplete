const OngoingLivestram = () => {
    const ongoingStreams = [
        {
            id: 1,
            name: "Kenya's Development Journey",
            image: "https://picsum.photos/200/300",
            streaming_id: "98765",
        },
        {
            id: 2,
            name: "Lamu Port Development",
            image: "https://picsum.photos/200/301",
            streaming_id: "12345",
        },
        {
            id: 3,
            name: "Affordable Housing Program",
            image: "https://picsum.photos/200/302",
            streaming_id: "67890",
        },
    ];

    const handleStreamClick = (stream) => {
        window.open(`https://www.youtube.com/watch?v=${stream.streaming_id}`, "_blank");
    };

    return (
        <div className="flex items-center justify-center space-x-4 overflow-x-auto rounded-lg">
            {ongoingStreams.map((stream) => (
                <div
                    key={stream.id}
                    className="flex flex-col space-y-2 cursor-pointer"
                    onClick={() => handleStreamClick(stream)}
                >
                    <div className="relative">
                        <img
                            src={stream.image}
                            alt={stream.name}
                            className="w-8 h-auto"
                        />
                        <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    </div>
                    <p className="text-xs font-bold">
                        {stream.name.length > 10 ? (
                            <>
                                {stream.name.slice(0, 10)}----
                            </>
                        ) : (
                            stream.name
                        )}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default OngoingLivestram;