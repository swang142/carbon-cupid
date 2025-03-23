"use client";

import { useToast } from "@/hooks/use-toast";
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({
				id,
				title,
				description,
				action,
				...props
			}) {
				return (
					<Toast
						key={id}
						{...props}
						className={`${props.className || ""} opacity-100`}
					>
						<div className="grid gap-1">
							{title && (
								<ToastTitle className="opacity-100">
									{title}
								</ToastTitle>
							)}
							{description && (
								<ToastDescription className="opacity-100">
									{description}
								</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
