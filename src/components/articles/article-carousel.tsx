
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
import Link from "next/link"
import ReactMarkdown from "react-markdown"

export function ArticleCarousel({ articles }: { articles: Article[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: articles.length > 2, // Only loop if there are enough items to scroll past the initial view
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {articles.map((article) => (
          <CarouselItem key={article.id} className="pl-4 md:pl-6 basis-[85%] sm:basis-[45%] md:basis-[40%] lg:basis-[30%] xl:basis-[22%]">
            <div className="p-1 h-full">
              <Card className="overflow-hidden flex flex-col h-full group">
                <Link href={`/articles/${article.id}`} className="block overflow-hidden">
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
                </Link>
                <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors leading-tight">
                        <Link href={`/articles/${article.id}`}>{article.title}</Link>
                    </h3>
                    <div className="text-muted-foreground text-sm flex-grow line-clamp-3 prose dark:prose-invert prose-sm">
                      {article.excerpt ? (
                          <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="text-muted-foreground" {...props} />,
                                a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />
                            }}
                          >{article.excerpt}</ReactMarkdown>
                      ) : null}
                    </div>
                    <Link href={`/articles/${article.id}`} className="text-sm font-semibold text-primary hover:underline mt-4 self-start">
                        Read More &rarr;
                    </Link>
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
