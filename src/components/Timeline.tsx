import { Experience } from "@/lib/schemas";
import TimelineItem from "./TimelineItem";
import TimelineRail from "./TimelineRail";
import { Card, CardContent } from "./ui/Card";

interface Props {
  experience: Experience[];
}

export default function Timeline({ experience }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <TimelineRail>
          {experience.map((exp, id) => (
            <TimelineItem key={id} experience={exp} />
          ))}
        </TimelineRail>
      </CardContent>
    </Card>
  );
}
