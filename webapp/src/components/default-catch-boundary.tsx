import type { ErrorComponentProps } from "@tanstack/react-router";
import {
	ErrorComponent,
	Link,
	rootRouteId,
	useMatch,
	useRouter,
} from "@tanstack/react-router";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
			<ErrorComponent error={error} />
			<div className="flex flex-wrap items-center gap-2">
				<button
					type="button"
					className={
						"rounded bg-secondary px-2 py-1 font-extrabold text-secondary-foreground uppercase"
					}
					onClick={() => {
						router.invalidate();
					}}
				>
					Try Again
				</button>
				{isRoot ? (
					<Link
						className={
							"rounded bg-secondary px-2 py-1 font-extrabold text-secondary-foreground uppercase"
						}
						to="/"
					>
						Home
					</Link>
				) : (
					<Link
						className={
							"rounded bg-secondary px-2 py-1 font-extrabold text-secondary-foreground uppercase"
						}
						onClick={(e) => {
							e.preventDefault();
							window.history.back();
						}}
						to="/"
					>
						Go Back
					</Link>
				)}
			</div>
		</div>
	);
}
