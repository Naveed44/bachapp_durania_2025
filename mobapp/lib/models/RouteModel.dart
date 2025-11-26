
import 'dart:convert' as convert;

class RouteModel {
    late String id;
    late String name;
    String? description;
    late String version;
    late Map<String, dynamic>? route;
    String? deletedAt;

    RouteModel({required this.id, required this.name, this.description, required this.version, this.route, this.deletedAt});

    RouteModel.fromJson(Map<String, dynamic> json) {
        id = json['id'];
        name = json['name'];
        description = json['description'];
        version = json['version'];
        route = json['route'];
        deletedAt = json['deleted_at'];
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> data = <String, dynamic>{};
        data['id'] = this.id;
        data['name'] = this.name;
        data['description'] = this.description;
        data['version'] = this.version;
        data['route'] = this.route;
        data['deleted_at'] = this.deletedAt;
        return data;
    }

    @override
    String toString() {
        return 'RouteModel{id: $id, name: $name, description: $description, version: $version, route: $route, deletedAt: $deletedAt}';
    }

}
