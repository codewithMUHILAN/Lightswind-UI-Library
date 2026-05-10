import jwt from "jsonwebtoken";

export async function verifyUser(authHeader: string | null) {
    if (!authHeader) return null;
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded; // e.g., { uid, email, paid: true }
    } catch (e) {
        return null;
    }
}
