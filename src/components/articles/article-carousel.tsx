'use client';

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { type Article } from "@/lib/definitions"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { ShareButton } from "./share-button";

export function ArticleCarousel({ articles }: { articles: Article[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: articles.length > 3,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {articles.map((article) => (
          <CarouselItem key={article.id} className="pl-4 md:pl-6 basis-[85%] sm:basis-[45%] md:basis-[40%] lg:basis-[30%] xl:basis-[22%]">
            <div className="p-1 h-full">
              <Card className="overflow-hidden flex flex-col h-full group">
                <a href={`/articles/${article.id}`} className="block overflow-hidden relative">
                    {article.image_url && (
                    <div className="relative w-full aspect-[16/9]">
                        <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    )}
                </a>
                <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 transition-colors leading-tight">
                        <a href={`/articles/${article.id}`}>{article.title}</a>
                    </h3>
                    <div className="text-muted-foreground text-sm flex-grow line-clamp-3 prose dark:prose-invert prose-sm">
                      {article.excerpt ? (
                          <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="text-muted-foreground" {...props} />,
                                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />
                            }}
                          >{article.excerpt}</ReactMarkdown>
                      ) : null}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <a href={`/articles/${article.id}`} className="text-sm font-semibold text-primary hover:underline">
                            Read More &rarr;
                        </a>
                        <ShareButton title={article.title} url={`/articles/${article.id}`} />
                    </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  )
}
