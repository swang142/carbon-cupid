"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Button } from "@/components/ui";
import { Sprout, Building2 } from "lucide-react";

const JoinPage = () => {
	const router = useRouter();

	const handleSelection = (type: "fundee" | "funder") => {
		router.push(`/register/${type}`);
	};

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<main className="flex-1 flex items-center justify-center px-4 py-12 mt-16">
				<div className="w-full max-w-4xl mx-auto">
					<div className="text-center mb-10 animate-fade-in">
						<h1 className="text-3xl font-bold tracking-tight mb-3">
							Join CarbonCupid
						</h1>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Choose whether you represent a growing organization
							looking for funding or an investor looking to fund
							promising sustainability projects.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
						<Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 group">
							<CardContent className="p-6 flex flex-col items-center text-center">
								<div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
									<Sprout className="h-8 w-8 text-primary" />
								</div>
								<h2 className="text-xl font-semibold mb-2">
									I'm a Fundee
								</h2>
								<p className="text-muted-foreground mb-6">
									Register as an organization looking for
									funding for your sustainability projects.
								</p>
								<Button
									onClick={() => handleSelection("fundee")}
									className="w-full mt-auto hover:cursor-pointer"
								>
									Register as Fundee
								</Button>
							</CardContent>
						</Card>

						<Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 group">
							<CardContent className="p-6 flex flex-col items-center text-center">
								<div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
									<Building2 className="h-8 w-8 text-primary" />
								</div>
								<h2 className="text-xl font-semibold mb-2">
									I'm a Funder
								</h2>
								<p className="text-muted-foreground mb-6">
									Register as an investor looking to fund
									promising sustainability projects.
								</p>
								<Button
									onClick={() => handleSelection("funder")}
									className="w-full mt-auto hover:cursor-pointer"
								>
									Register as Funder
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default JoinPage;
