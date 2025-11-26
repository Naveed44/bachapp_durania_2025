import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../blocs/map_toggle_cubit.dart';

class MapTogglePage extends StatelessWidget {
    final Map<String, dynamic> route;

    const MapTogglePage({
        super.key,
        required this.route
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
                            Navigator.of(context).pop();
                        },
                        title: Text(route['name'], style: const TextStyle(fontSize: 20)),
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
                                    route['name'],
                                    style: const TextStyle(
                                        fontSize: 20
                                    ),
                                )
                            ],
                        ),
                    ),*/
                    BlocBuilder<MapToggleCubit, Map<String, bool>>(
                        builder: (context, state) {
                            return ListTile(
                                onTap: () {
                                    context.read<MapToggleCubit>().toggle('inboundRoute');
                                },
                                title: const Text('Ruta de ida'),
                                leading: state['inboundRoute']!
                                    ? const Icon(
                                        Icons.remove_red_eye,
                                        size: 25
                                    )
                                    : const Icon(
                                        Icons.remove_red_eye_outlined,
                                        size: 25
                                    ),
                                visualDensity: VisualDensity.compact,
                            );
                        }
                    ),
                    BlocBuilder<MapToggleCubit, Map<String, bool>>(
                        builder: (context, state) {
                            return ListTile(
                                onTap: () {
                                    context.read<MapToggleCubit>().toggle('outboundRoute');
                                },
                                title: const Text('Ruta de retorno'),
                                leading: state['outboundRoute']!
                                    ? const Icon(
                                        Icons.remove_red_eye,
                                        size: 25
                                    )
                                    : const Icon(
                                        Icons.remove_red_eye_outlined,
                                        size: 25
                                    ),
                                visualDensity: VisualDensity.compact,
                            );
                        }
                    ),
                    /*BlocBuilder<MapToggleCubit, Map<String, bool>>(
                        builder: (context, state) {
                            return ListTile(
                                onTap: () {
                                    context.read<MapToggleCubit>().toggle('markers');
                                },
                                title: const Text('Marcadores'),
                                leading: Checkbox.adaptive(
                                    value: state['markers']!,
                                    onChanged: (value) {
                                        context.read<MapToggleCubit>().toggle('markers');
                                    }
                                ),
                                visualDensity: VisualDensity.compact,
                                contentPadding: EdgeInsets.zero
                            );
                        }
                    ),*/
                ],
            ),
        );
    }
}
