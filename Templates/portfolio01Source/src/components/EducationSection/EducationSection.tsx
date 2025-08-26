import { Card, CardHeader, CardTitle, CardContent } from "../lightswind/card";
import ProfessionalProfile from "./SkillCategory";
import { motion } from "framer-motion";

export const EducationSection = () => {
  return (
    <motion.section
      id="education"
      className="space-y-10 py-10 px-6"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Education */}
      <div>
        <motion.h3
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Education
        </motion.h3>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-1 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader>
              <CardTitle>M.Sc. in Computer Science</CardTitle>
              <p className="text-sm text-muted-foreground">
                University of Chennai — 2016 – 2018
              </p>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Specialized in <strong>Software Architecture</strong>,
                <strong> Distributed Systems</strong>, and
                <strong> Artificial Intelligence Applications</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Thesis on Machine Learning for Predictive Analytics</li>
                <li>Led a research project on Cloud-Based ERP solutions</li>
                <li>Published 2 papers in IEEE conferences</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>B.Sc. in Information Technology</CardTitle>
              <p className="text-sm text-muted-foreground">
                Anna University — 2013 – 2016
              </p>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Gained strong foundation in <strong>Programming</strong>,
                <strong> Networking</strong>, and
                <strong> Database Management</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Top 5% in Software Engineering coursework</li>
                <li>Developed a campus-wide library management system</li>
                <li>Organized annual tech fest for 3 consecutive years</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ProfessionalProfile />
    </motion.section>
  );
};
