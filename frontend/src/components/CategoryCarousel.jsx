// src/components/CategoryCarousel.jsx
import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";
import { Button } from "../components/ui/button"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="my-20">
            <Carousel className="w-full max-w-xl mx-auto">
                <CarouselContent>
                    {categories.map((cat) => (
                        <CarouselItem key={cat} className="flex justify-center p-4">
                            <Button
                                onClick={() => searchJobHandler(cat)}
                                variant="outline"
                                className="rounded-full px-6 py-3"
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
