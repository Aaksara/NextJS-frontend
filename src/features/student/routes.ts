export const STUDENT_HOME = "/student";

export const STUDENT_LISTINGS = `${STUDENT_HOME}/listings`;

export const STUDENT_MESSAGES = `${STUDENT_HOME}/messages`;

/** The messages page with one conversation open. */
export const conversationPath = (id: number) => `${STUDENT_MESSAGES}?c=${id}`;
