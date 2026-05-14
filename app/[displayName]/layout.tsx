import type { Metadata } from 'next';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

type Props = {
  params: Promise<{ displayName: string }>
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { displayName } = await params;
  const decodedName = decodeURIComponent(displayName);

  let title = `${decodedName}의 링크`;
  let description = `${decodedName}님이 공유한 다양한 링크를 확인해보세요.`;
  let images: string[] = [];

  try {
    const q = query(collection(db, "users"), where("displayName", "==", decodedName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      if (userData.username) {
        title = `${userData.username} (@${decodedName})의 링크`;
      }
      if (userData.bio && userData.bio !== "한 줄 소개를 입력해주세요") {
        description = userData.bio;
      }
      if (userData.photoURL) {
        images = [userData.photoURL];
      }
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | MyLink`,
      description,
      url: `/${displayName}`,
      ...(images.length > 0 && { images }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | MyLink`,
      description,
      ...(images.length > 0 && { images }),
    }
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
