import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-8 items-center px-24 pt-12">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-bold text-3xl lg:flex">
          <p className="font-sans italic text-4xl text-black">
            VisualizeIt
            <span className="font-bold text-blue-500">.ai</span>
          </p>
          <div className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
            <Link href="/">
              <Button className="font-bold text-xl">Launch App</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 items-center mt-24">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-4xl font-bold text-primary ">
              Welcome to <p className="font-sans italic text-4xl text-black">
                VisualizeIt
                <span className="font-bold text-blue-500">.ai</span>
              </p>
            </div>
            <p className="text-muted-foreground">
              A tool for creators and story tellers to create visuals for their narrration automatically using AI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 px-20 mt-10">
          <Card className="shadow-sm border-none h-full w-full rounded-lg bg-yellow-200 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
            <CardHeader>
              <CardDescription className="text-center pt-1 text-lg text-black">
                This is a test feature of VisualizeIt.ai
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border-none h-full w-full rounded-lg bg-yellow-200 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
            <CardHeader>
              <CardDescription className="text-center pt-1 text-lg text-black">
                This is a test feature of VisualizeIt.ai
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border-none h-full w-full rounded-lg bg-yellow-200 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
            <CardHeader>
              <CardDescription className="text-center pt-1 text-lg text-black">
                This is a test feature of VisualizeIt.ai
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
      <footer className="fixed container bottom-4 w-full">
        <div className="flex justify-center items-center w-full ml-10">
          <p className="text-muted-foreground">
            &copy;{" "}
            <a href="https://www.alphadevs.dev/" target="_blank">
              alphadevs.dev
            </a>{" "}
          </p>
        </div>
      </footer>
    </>
  )
}
