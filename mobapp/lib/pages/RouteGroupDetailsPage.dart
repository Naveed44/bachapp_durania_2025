import 'package:DIAPotholeReporter1/blocs/map_toggle_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_map/flutter_map.dart';

import '../blocs/Routes/route_bloc.dart';
import '../blocs/map_controller_cubit.dart';
import '../models/RouteGroupModel.dart';
import 'MapTogglePage.dart';

class RouteGroupDetailPage extends StatelessWidget {
    final RouteGroupModel routeGroupModel;

    const RouteGroupDetailPage({
        super.key,
        required this.routeGroupModel
    });

    @override
    Widget build(BuildContext context) {
        return Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                    ListTile(
                        onTap: () {
                            context.read<RouteBloc>().add(UnloadRoute());
                            context.read<MapToggleCubit>().reset();
                            Navigator.of(context).pop();
                        },
                        title: Text(routeGroupModel.name, style: const TextStyle(fontSize: 20)),
                        leading: const Icon(
                            Icons.arrow_back_ios,
                            size: 20
                        ),
                        visualDensity: VisualDensity.compact,
                        contentPadding: EdgeInsets.zero
                    ),
                    /*GestureDetector(
                        onTap: () {

                        },
                        child: Row(
                            children: [
                                Icon(
                                    Icons.arrow_back_ios,
                                    color: Theme.of(context).hintColor,
                                    size: 20,
                                ),
                                const SizedBox(width: 20),
                                Text(
                                    routeGroupModel.name,
                                    style: const TextStyle(
                                        fontSize: 20
                                    ),
                                )
                            ],
                        ),
                    ),*/
                    const SizedBox(height: 10),
                    ConstrainedBox(
                        constraints: BoxConstraints(
                            maxWidth: MediaQuery.of(context).size.width - 25
                        ),
                        child: Text(
                            routeGroupModel.description ?? 'Sin descripción.',
                            style: const TextStyle(fontSize: 14)
                        )
                    ),
                    const SizedBox(height: 20),
                    Column(
                        children: [
                            if (routeGroupModel.routes?.isEmpty ?? true)
                            const Text('No hay rutas.')
                            else
                            ...routeGroupModel.routes!.map((e) {
                                    return ListTile(
                                        onTap: () {
                                            // _dialogBuilder(context);
                                            MapController mapController = context.read<MapControllerCubit>().getMapController();
                                            context.read<RouteBloc>().add(LoadRouteById(
                                                    routeGroupId: routeGroupModel.id,
                                                    routeId: e["id"],
                                                    mapController: mapController
                                                ));
                                            Navigator.of(context).push(
                                                MaterialPageRoute(
                                                    builder: (_) => MapTogglePage(route: e)
                                                )
                                            );
                                        },
                                        title: Text(e["name"]),
                                        // subtitle: Text(e["description"] ?? 'Sin descripción.'),
                                        leading: const Icon(
                                            Icons.directions_bus,
                                            size: 30
                                        ),
                                        visualDensity: VisualDensity.compact,
                                        contentPadding: EdgeInsets.zero
                                    );
                                }
                            )
                        ],
                    )

                ],
            )
        );
    }
}
