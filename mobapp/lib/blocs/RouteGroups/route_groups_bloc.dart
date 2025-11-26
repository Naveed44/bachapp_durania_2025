
import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../../utils/http.dart' as http;
import '../../models/RouteGroupModel.dart';
import 'dart:convert';

part 'route_groups_event.dart';
part 'route_groups_state.dart';

class RouteGroupsBloc extends Bloc<RoutesEvent, RouteGroupsState> {
  RouteGroupsBloc() : super(RouteGroupsInitial()) {
        on<RouteGroupsLoadRoutes>((event, emit) async {
                emit(RouteGroupsLoading());

                String url = dotenv.env['API_URL']!;
                url = "${url}api/v1/routes";

                dynamic response = await http.get(url);

                if (response.statusCode == 200) {
                    // print(response.body);
                    List<RouteGroupModel> routeGroups = List<RouteGroupModel>.from((json.decode(response.body) as List).map((x) => RouteGroupModel.fromJson(x)));
                    emit(RouteGroupsLoaded(routes: routeGroups));
                } else {
                    emit(RouteGroupsError(message: response.body.toString()));
                }
            }
        );
    }
}
