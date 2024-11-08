import React from "react";
import { CommentForm } from "./CommentForm";

export const CommentSection = ({
	commentSectionRef,
	count,
	onCommentSubmit,
}) => {
	return (
		<section
			ref={commentSectionRef}
			className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 snap-start relative overflow-hidden"
		>
			<CommentForm onCommentSubmit={onCommentSubmit} count={count} />
		</section>
	);
};
