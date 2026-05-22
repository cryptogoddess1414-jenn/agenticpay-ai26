import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";

const codeExamples = {
  payments: {
    label: "Payments",
    code: `import 'package:flutterstack/flutterstack.dart';

class CheckoutScreen extends StatelessWidget {
  Future<void> processPayment() async {
    final payment = await FlutterStack.payments.create(
      amount: 2999,
      currency: 'usd',
      method: PaymentMethod.card,
    );
    
    if (payment.success) {
      // 🎉 Payment processed!
      Navigator.pushNamed(context, '/success');
    }
  }

  @override
  Widget build(BuildContext context) {
    return PaymentSheet(
      onSubmit: processPayment,
      theme: PaymentTheme.minimal,
    );
  }
}`,
  },
  auth: {
    label: "Auth",
    code: `import 'package:flutterstack/auth.dart';

class LoginScreen extends StatelessWidget {
  Future<void> signIn() async {
    final user = await FlutterStack.auth.signIn(
      provider: AuthProvider.google,
      scopes: ['email', 'profile'],
    );
    
    print('Welcome, \${user.displayName}!');
  }

  @override
  Widget build(BuildContext context) {
    return AuthWidget(
      providers: [
        AuthProvider.google,
        AuthProvider.apple,
        AuthProvider.github,
      ],
      onSuccess: (user) => goToDashboard(),
    );
  }
}`,
  },
  database: {
    label: "Database",
    code: `import 'package:flutterstack/database.dart';

class TodoService {
  final db = FlutterStack.database;

  Stream<List<Todo>> watchTodos() {
    return db
      .collection('todos')
      .where('userId', isEqualTo: currentUser.id)
      .orderBy('createdAt', descending: true)
      .snapshots()
      .map((snap) => snap.docs
        .map((doc) => Todo.fromJson(doc.data))
        .toList());
  }

  Future<void> addTodo(String title) async {
    await db.collection('todos').add({
      'title': title,
      'completed': false,
      'createdAt': DateTime.now(),
    });
  }
}`,
  },
};

export default function CodePreviewSection() {
  const [activeTab, setActiveTab] = useState("payments");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Developer Experience</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-6">
              Ship in{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                minutes,
              </span>
              {" "}not months
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Our SDK is designed for Flutter-first development. Type-safe APIs, 
              auto-generated models, and widgets that just work — so you can focus 
              on building beautiful experiences.
            </p>
            <div className="space-y-4">
              {[
                "Type-safe Dart SDK with null safety",
                "Pre-built UI widgets with theming",
                "Auto-generated model classes",
                "Offline-first architecture",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Code Block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-primary/15 to-purple-500/15 rounded-3xl blur-xl" />
              <div className="relative bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent h-auto p-0 gap-1">
                      {Object.entries(codeExamples).map(([key, val]) => (
                        <TabsTrigger
                          key={key}
                          value={key}
                          className="data-[state=active]:bg-[#1c2128] data-[state=active]:text-white text-[#8b949e] rounded-lg px-3 py-1.5 text-xs font-medium"
                        >
                          {val.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg hover:bg-[#1c2128] transition-colors text-[#8b949e] hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {/* Code */}
                <pre className="p-5 text-[13px] leading-6 overflow-x-auto font-mono text-[#c9d1d9]">
                  <code>{codeExamples[activeTab].code}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}