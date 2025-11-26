
import 'package:http/http.dart' as http;


Future<http.Response> get(String url) async {
  return http.get(Uri.parse(url));
}

Future<http.Response> post(String url, Map<String, String> body) async {
  return http.post(Uri.parse(url), body: body);
}