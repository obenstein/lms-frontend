interface LearningObjectivesCardProps {
  objectives: string[];
}

export const LearningObjectivesCard = ({ objectives }: LearningObjectivesCardProps) => {
  return (
    <div className="p-4 bg-green-100 rounded-xl mt-4">
      <h2 className="text-lg font-semibold mb-2">🧠 What You’ll Learn</h2>
      <ul className="list-disc list-inside text-sm text-gray-700">
        {objectives.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};