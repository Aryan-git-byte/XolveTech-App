import 'package:flutter_test/flutter_test.dart';
import 'package:xolvetech_app/app/app.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const XolveTechApp());
    expect(find.text('XolveTech'), findsOneWidget);
  });
}