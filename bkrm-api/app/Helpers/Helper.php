<?php

/**
 * zThis is helper file
 *
 */

if (!function_exists('Quartile')) {
    function Quartile($Array, $Quartile){
        sort($Array);
        $pos = (count($Array) - 1) * $Quartile;

        $base = floor($pos);
        $rest = $pos - $base;

        if (isset($Array[$base + 1])) {
            return $Array[$base] + $rest * ($Array[$base + 1] - $Array[$base]);
        } else {
            return $Array[$base];
        }
    }
}

if (!function_exists('getExtreme')) {
    function getExtreme($Array) {
        $Q1 = Quartile($Array, 0.25);
        $Q3 = Quartile($Array, 0.75);

        $IQR = $Q3 - $Q1;
        return $Q3 + 1.5*$IQR;
    }
}
